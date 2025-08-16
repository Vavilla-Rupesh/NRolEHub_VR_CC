
import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

function Modal({ isOpen, onClose, title, children, fullScreen = false, size = 'md' }) {
  const getSizeClasses = () => {
    const sizes = {
      sm: 'w-[90vw] max-w-md',
      md: 'w-[90vw] max-w-2xl',
      lg: 'w-[90vw] max-w-4xl',
      xl: 'w-[90vw] max-w-6xl'
    };
    return sizes[size] || sizes.md;
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        {/* Enhanced Overlay with smooth fade */}
        <Dialog.Overlay className="fixed inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-300" />
        
        <Dialog.Content 
          className={`
            fixed z-50
            ${fullScreen 
              ? 'inset-0 m-0 rounded-none max-h-screen' 
              : `top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] ${getSizeClasses()} max-h-[85vh] rounded-2xl`
            }
            bg-white dark:bg-gray-900
            border border-gray-200/50 dark:border-gray-700/50
            shadow-2xl shadow-black/25
            data-[state=open]:animate-in
            data-[state=closed]:animate-out
            data-[state=closed]:fade-out-0
            data-[state=open]:fade-in-0
            data-[state=closed]:zoom-out-95
            data-[state=open]:zoom-in-95
            data-[state=closed]:slide-out-to-left-1/2
            data-[state=closed]:slide-out-to-top-[48%]
            data-[state=open]:slide-in-from-left-1/2
            data-[state=open]:slide-in-from-top-[48%]
            duration-300
            overflow-hidden
            focus:outline-none
          `}
        >
          {/* Header with gradient border */}
          <div className="relative border-b border-gray-200/60 dark:border-gray-700/60 bg-gradient-to-r from-gray-50/50 via-white to-gray-50/50 dark:from-gray-800/50 dark:via-gray-900 dark:to-gray-800/50">
            <div className="flex items-center justify-between p-6 pr-16">
              <Dialog.Title className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                {title}
              </Dialog.Title>
              
              {/* Premium close button */}
              <Dialog.Close className="absolute top-4 right-4 inline-flex items-center justify-center rounded-xl w-10 h-10 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900">
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Dialog.Close>
            </div>
          </div>

          {/* Content area with custom scrollbar */}
          <div className={`
            ${fullScreen ? 'h-[calc(100%-80px)]' : 'max-h-[calc(85vh-80px)]'}
            overflow-y-auto
            scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 
            scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500
          `}>
            <div className="p-6">
              {children}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default Modal;
