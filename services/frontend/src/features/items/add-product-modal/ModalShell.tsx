import { Fragment, PropsWithChildren } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

type Props = PropsWithChildren<{
  open: boolean;
  title: string;
  onClose(): void;
}>;

export default function ModalShell({ open, title, onClose, children }: Props) {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-md dark:bg-black/70" />
        </Transition.Child>

        <div className="fixed inset-0 grid place-items-center p-4 sm:p-6">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="scale-95 opacity-0"
            enterTo="scale-100 opacity-100"
            leave="ease-in duration-200"
            leaveFrom="scale-100 opacity-100"
            leaveTo="scale-95 opacity-0"
          >
            <Dialog.Panel className="flex w-full max-w-lg sm:max-w-3xl max-h-[90vh] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-800 dark:shadow-gray-900 transition-all">
              <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {title}
                </Dialog.Title>
                <button
                  type="button"
                  className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-brand dark:text-gray-400 dark:hover:bg-gray-700"
                  onClick={onClose}
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </header>

              {children}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
