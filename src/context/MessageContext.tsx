// src/context/MessageContext.tsx
import React, { createContext, useContext, useEffect } from 'react'
import { message } from 'antd'

export const messageApi = {
    open: (params: Parameters<typeof message.open>[0]) => {console.log(params);
     },
    error: (content: string) => {console.log(content); },
    success: (content: string) => { console.log(content);},
    info: (content: string) => { console.log(content);},
    warning: (content: string) => { console.log(content);},
}

const MessageContext = createContext(null)

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [api, contextHolder] = message.useMessage()

    useEffect(() => {
        messageApi.open = api.open
        messageApi.error = api.error
        messageApi.success = api.success
        messageApi.info = api.info
        messageApi.warning = api.warning
    }, [api])

    return (
        <MessageContext.Provider value={null}>
            {contextHolder}
            {children}
        </MessageContext.Provider>
    )
}

export const useMessageApi = () => useContext(MessageContext)
