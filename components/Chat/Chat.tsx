import {throttle} from '@/utils';
import {IconClearAll} from '@tabler/icons-react';
import {useTranslation} from 'next-i18next';
import {FC, memo, MutableRefObject, useEffect, useRef, useState} from 'react';
import {ChatInput} from './ChatInput';
import {ChatLoader} from './ChatLoader';
import {ChatMessage} from './ChatMessage';
import {KeyValuePair, Message} from "@/types/chat";
import {Conversation} from "@/types/conversation";
import {KeyConfiguration} from "@/types/keyConfiguration";
import {IndexGallery} from "@/components/Chat/IndexGallery";
import {IndexFormTabs} from "@/components/Chat/IndexFormTabs";

interface Props {
  conversation: Conversation;
  keyConfiguration: KeyConfiguration;
  messageIsStreaming: boolean;
  loading: boolean;
  onSend: (message: Message, deleteCount?: number) => void;
  onUpdateConversation: (
    conversation: Conversation,
    data: KeyValuePair,
  ) => void;
  onEditMessage: (message: Message, messageIndex: number) => void;
  stopConversationRef: MutableRefObject<boolean>;
  handleKeyConfigurationValidation: () => boolean;
  isShowIndexFormTabs: boolean;
  handleShowIndexFormTabs: (isShowIndexFormTabs: boolean) => void;
}

export const Chat: FC<Props> = memo(
  ({
     conversation,
     keyConfiguration,
     messageIsStreaming,
     loading,
     onSend,
     onUpdateConversation,
     onEditMessage,
     stopConversationRef,
     handleKeyConfigurationValidation,
     isShowIndexFormTabs,
     handleShowIndexFormTabs,
   }) => {
    const {t} = useTranslation('chat');
    const [currentMessage, setCurrentMessage] = useState<Message>();
    const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string>();
    const [isUploadSuccess, setIsUploadSuccess] = useState(true);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleIsUploading = (isUploading: boolean) => {
      setIsUploading(isUploading);
    }

    const handleIsUploadSuccess = (isUploadSuccess: boolean) => {
      setIsUploadSuccess(isUploadSuccess);
    }

    const handleUploadError = (errorMsg: string) => {
      setErrorMsg(errorMsg);
    }

    const onClearAll = () => {
      if (confirm(t<string>('Are you sure you want to clear all messages?'))) {
        onUpdateConversation(conversation, {key: 'messages', value: []});
      }
    };

    const scrollDown = () => {
      if (autoScrollEnabled) {
        messagesEndRef.current?.scrollIntoView(true);
      }
    };
    const throttledScrollDown = throttle(scrollDown, 250);

    useEffect(() => {
      throttledScrollDown();
      setCurrentMessage(
        conversation.messages[conversation.messages.length - 2],
      );
    }, [conversation.messages, throttledScrollDown]);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setAutoScrollEnabled(entry.isIntersecting);
          if (entry.isIntersecting) {
            textareaRef.current?.focus();
          }
        },
        {
          root: null,
          threshold: 0.5,
        },
      );
      const messagesEndElement = messagesEndRef.current;
      if (messagesEndElement) {
        observer.observe(messagesEndElement);
      }
      return () => {
        if (messagesEndElement) {
          observer.unobserve(messagesEndElement);
        }
      };
    }, [messagesEndRef]);

    return (
      <>
        {isShowIndexFormTabs ? (
          <IndexFormTabs keyConfiguration={keyConfiguration}
                         handleKeyConfigurationValidation={handleKeyConfigurationValidation}
                         handleShowIndexFormTabs={handleShowIndexFormTabs}/>
        ) : (
          <div className="overflow-none relative flex-1 bg-white dark:bg-[#343541]">
            <>
              <div
                className="max-h-full overflow-x-hidden"
                ref={chatContainerRef}
              >
                {(conversation.index?.indexName.length === 0) && (conversation.messages.length === 0) ? (
                  <>
                    <IndexGallery keyConfiguration={keyConfiguration}
                                  handleKeyConfigurationValidation={handleKeyConfigurationValidation}
                                  handleShowIndexFormTabs={handleShowIndexFormTabs}
                                  onIndexChange={(index) =>
                                    onUpdateConversation(conversation, {
                                      key: 'index',
                                      value: index,
                                    })}/>
                  </>
                ) : (
                  <>
                    <div
                      className="flex justify-center border border-b-neutral-300 bg-neutral-100 py-2 text-sm text-neutral-500 dark:border-none dark:bg-[#444654] dark:text-neutral-200">
                      {t('File')}: {conversation.index.indexName}
                      <IconClearAll
                        className="ml-2 cursor-pointer hover:opacity-50"
                        onClick={onClearAll}
                        size={18}
                      />
                    </div>
                    {conversation.messages.map((message, index) => (
                      <ChatMessage
                        key={index}
                        message={message}
                        messageIndex={index}
                        onEditMessage={onEditMessage}
                      />
                    ))}

                    {loading && <ChatLoader/>}

                    <div
                      className="h-[162px] bg-white dark:bg-[#343541]"
                      ref={messagesEndRef}
                    />
                  </>
                )}
              </div>

              <ChatInput
                stopConversationRef={stopConversationRef}
                textareaRef={textareaRef}
                messageIsStreaming={messageIsStreaming}
                conversationIsEmpty={conversation.messages.length > 0}
                onSend={(message) => {
                  setCurrentMessage(message);
                  onSend(message);
                }}
                onRegenerate={() => {
                  if (currentMessage) {
                    onSend(currentMessage, 2);
                  }
                }}
                handleKeyConfigurationValidation={handleKeyConfigurationValidation}
              />
            </>
          </div>
        )}
      </>
    );
  },
);
Chat.displayName = 'Chat';
