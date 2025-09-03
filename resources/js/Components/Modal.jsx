import {
    Dialog,
    DialogPanel,
    Transition,
    TransitionChild,
} from '@headlessui/react';
import ModalFooterActions from './Molecules/ModalFooterActions';

import { useTranslation } from 'react-i18next';

export default function Modal({
    children,
    show = false,
    type = "add",
    maxWidth = '2xl',
    closeable = true,
    onClose = () => { },
    title,
    onSubmit,
    onCancel,
    processing,
}) {

    const { t } = useTranslation();

    const close = () => {
        if (closeable) {
            onClose();
        }
    };

    const maxWidthClass = {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-md',
        lg: 'sm:max-w-lg',
        xl: 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
        '3xl': 'sm:max-w-3xl',
        '4xl': 'sm:max-w-4xl',
        '5xl': 'sm:max-w-5xl',
    }[maxWidth];

    return (
        <Transition show={show} leave="duration-200">
            <Dialog
                as="div"
                id="modal"
                className="fixed inset-0 z-50 flex transform items-center overflow-y-auto px-4 py-6 transition-all sm:px-0"
                onClose={close}
            >
                <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="absolute inset-0 bg-gray-500/75" />
                </TransitionChild>

                <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                    <DialogPanel
                        className={`mb-6 transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:mx-auto sm:w-full ${maxWidthClass}`}
                    >
                        <div className="px-6 py-4 border-b font-semibold text-lg sticky top-0 bg-white z-10">
                            <h2 className="text-lg font-medium text-gray-900">
                                {(type === "add" ? t("global.create") : t("global.edit"))} {title}
                            </h2>
                        </div>

                        <form onSubmit={onSubmit}>
                            <div className='overflow-y-auto scroll-smooth max-h-[calc(100vh-20rem)]  p-6 space-y-6'>
                                {children}
                            </div>

                            <div className="px-6 py-4 border-t sticky bottom-0 bg-white z-10">
                                <ModalFooterActions onCancel={onCancel} processing={processing} />
                            </div>
                        </form>

                    </DialogPanel>
                </TransitionChild>
            </Dialog>
        </Transition>
    );
}