import { IconCheck, IconTrash, IconX } from '@tabler/icons-react';
import { FC, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { SidebarButton } from './SidebarButton';
import {Button} from "@/components/ui/button";
import {ArrowBigDownDash, Trash, Trash2} from "lucide-react";

interface Props {
  onClearConversations: () => void;
}

export const ClearConversations: FC<Props> = ({ onClearConversations }) => {
  const [isConfirming, setIsConfirming] = useState<boolean>(false);

  const { t } = useTranslation('sidebar');

  const handleClearConversations = () => {
    onClearConversations();
    setIsConfirming(false);
  };

  return isConfirming ? (
    <div className="flex w-full justify-start cursor-pointer items-center rounded-md py-2 px-3">
      <Trash className="mr-2 ml-1"/>

      <div className="flex-1 text-left text-md text-white">
        {t('Are you sure?')}
      </div>

      <div className="flex w-[40px]">
        <IconCheck
          className="ml-auto min-w-[20px] mr-1 text-neutral-400 hover:text-neutral-100"
          size={18}
          onClick={(e) => {
            e.stopPropagation();
            handleClearConversations();
          }}
        />

        <IconX
          className="ml-auto min-w-[20px] text-neutral-400 hover:text-neutral-100"
          size={18}
          onClick={(e) => {
            e.stopPropagation();
            setIsConfirming(false);
          }}
        />
      </div>
    </div>
  ) : (
    <Button className="w-full justify-start" variant="ghost" onClick={() => setIsConfirming(true)}>
      <Trash2 className="mr-2"/>{t('Clear conversations')}
    </Button>
  );
};
