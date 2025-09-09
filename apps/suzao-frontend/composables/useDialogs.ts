/// <reference path="../types/global.d.ts" />

import { ref, reactive } from 'vue'

interface DialogState {
  memberVip: boolean
  login: boolean
}

interface UseDialogsReturn {
  dialogs: DialogState
  openMemberVipDialog: () => void
  closeMemberVipDialog: () => void
  openLoginDialog: () => void
  closeLoginDialog: () => void
  closeAllDialogs: () => void
}

export const useDialogs = (): UseDialogsReturn => {
  const dialogs = reactive<DialogState>({
    memberVip: false,
    login: false
  })

  const openMemberVipDialog = () => {
    dialogs.memberVip = true
  }

  const closeMemberVipDialog = () => {
    dialogs.memberVip = false
  }

  const openLoginDialog = () => {
    dialogs.login = true
  }

  const closeLoginDialog = () => {
    dialogs.login = false
  }

  const closeAllDialogs = () => {
    dialogs.memberVip = false
    dialogs.login = false
  }

  return {
    dialogs,
    openMemberVipDialog,
    closeMemberVipDialog,
    openLoginDialog,
    closeLoginDialog,
    closeAllDialogs
  }
}