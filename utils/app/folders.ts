import {ChatFolder} from "@/types/chat";

export const saveFolders = (folders: ChatFolder[]) => {
  localStorage.setItem('folders', JSON.stringify(folders));
};
