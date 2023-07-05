import {IconFileExport, IconMoon, IconSun} from '@tabler/icons-react';
import {FC} from 'react';
import {useTranslation} from 'next-i18next';
import {ClearConversations} from './ClearConversations';
import {Import} from './Import';
import {SidebarButton} from './SidebarButton';
import {KeySettings} from './KeySettings';
import {Conversation} from "@/types/conversation";
import {ChatFolder} from "@/types/chat";
import {KeyConfiguration} from "@/types/keyConfiguration";
import {Button} from "@/components/ui/button";
import {ArrowBigDownDash, FileUp, ImportIcon, Moon, PlusCircle, Sun} from "lucide-react";

interface Props {
  lightMode: 'light' | 'dark';
  onToggleLightMode: (mode: 'light' | 'dark') => void;
  onClearConversations: () => void;
  onExportConversations: () => void;
  onImportConversations: (data: {
    conversations: Conversation[];
    folders: ChatFolder[];
  }) => void;
  keyConfiguration: KeyConfiguration;
  onKeyConfigurationChange: (keySettings: KeyConfiguration) => void;
  keyConfigurationButtonRef: React.RefObject<HTMLButtonElement>;
  handleShowIndexFormTabs: (isShowIndexFormTabs: boolean) => void;

}

export const SidebarSettings: FC<Props> = (
  {
    lightMode,
    onToggleLightMode,
    onClearConversations,
    onExportConversations,
    onImportConversations,
    keyConfiguration,
    onKeyConfigurationChange,
    keyConfigurationButtonRef,
    handleShowIndexFormTabs,
  }) => {
  const {t} = useTranslation('sidebar');

  return (
    <div className="flex flex-col justify-start items-center space-y-1 border-t border-white/20 pt-1 text-sm w-full">

      <Button className="w-full justify-start" variant="ghost" onClick={() => handleShowIndexFormTabs(true)}>
        <PlusCircle className="mr-2"/>Create New Index
      </Button>

      <ClearConversations onClearConversations={onClearConversations}/>

      <Import onImport={onImportConversations}/>

      <Button className="w-full justify-start" variant="ghost" onClick={() => onExportConversations()}>
        <FileUp className="mr-2"/>{t('Export conversations')}
      </Button>

      <Button className="w-full justify-start" variant="ghost" onClick={() => onToggleLightMode(lightMode === 'light' ? 'dark' : 'light')}>
        {
          lightMode === 'light' ? <Moon className="mr-2"/> : <Sun className="mr-2"/>
        }
        {lightMode === 'light' ? t('Dark mode') : t('Light mode')}
      </Button>

      <KeySettings keyConfiguration={keyConfiguration} onKeyConfigurationChange={onKeyConfigurationChange}
                   keyConfigurationButtonRef={keyConfigurationButtonRef}/>
    </div>
  );
};

