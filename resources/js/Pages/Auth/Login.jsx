import React, { useState } from 'react';
import LoginGoogleButton from '@/Components/Atoms/LoginGoogleButton';
import Checkbox from '@/Components/Checkbox';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {useTranslation} from 'react-i18next';

export default function Login({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: 'admin@superadmin.com',
        password: 'password',
        remember: false,
    });

    const [mode, setMode] = useState("login");
    const { t } = useTranslation();

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form className="space-y-6 py-10 px-6 pb-6" onSubmit={submit}>
                <h3 className="text-xl font-medium text-gray-900">
                    {mode === "login" ? t('global.loginTitle') : t('global.createAccountTitle')}
                </h3>
                {mode === "register" && (
                    <div>
                        <label htmlFor="name" className="text-sm font-medium text-gray-900 block mb-2">{t('global.name')}</label>
                        <TextInput
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={e => setData("name", e.target.value)}
                            required
                            className="w-full"
                            placeholder={t('global.name')}
                        />
                        {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                    </div>
                )}
                <div>
                    <label htmlFor="email" className="text-sm font-medium text-gray-900 block mb-2">{t('global.email')}</label>
                    <TextInput
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={e => setData("email", e.target.value)}
                        required
                        className="w-full"
                        placeholder="Email"
                    />
                    {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
                </div>
                <div>
                    <label htmlFor="password" className="text-sm font-medium text-gray-900 block mb-2">{t('global.password')}</label>
                    <TextInput
                        id="password"
                        type="password"
                        value={data.password}
                        onChange={e => setData("password", e.target.value)}
                        required
                        className="w-full"
                        placeholder="Password"
                    />
                    {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
                </div>
                {mode === "register" && (
                    <div>
                        <label htmlFor="password_confirmation" className="text-sm font-medium text-gray-900 block mb-2">{t('global.confirmPassword')}</label>
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            value={data.password_confirmation}
                            onChange={e => setData("password_confirmation", e.target.value)}
                            required
                            className="w-full"
                            placeholder={t('global.confirmPassword')}
                        />
                        {errors.password_confirmation && <div className="text-red-500 text-xs mt-1">{errors.password_confirmation}</div>}
                    </div>
                )}
                <div className="flex justify-between">
                    <div className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />
                        <label htmlFor="remember" className="ml-2 text-sm text-gray-900">{t('global.rememberMe')}</label>
                    </div>
                    {/* {mode === "login" && (
                        <Link
                            href={route("password.request")}
                            className="text-sm text-blue-700 hover:underline"
                        >
                            {t('global.lostPassword')}?
                        </Link>
                    )} */}
                </div>
                <button
                    type="submit"
                    className="w-full px-4 py-2 border bg-[#0E1C2D] align-center justify-center gap-2 border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-white hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-[#D9B36A] hover:shadow transition duration-150 flex items-center"
                    disabled={processing}
                >
                    {processing && (
                        <span className="mr-2">
                            <Spinner className="h-4 w-4 animate-spin" />
                        </span>
                    )}
                    {processing
                        ? t('global.processing')
                        : mode === "login"
                            ? t('global.login')
                            : t('global.register')}
                </button>
                <LoginGoogleButton />
                <div className="text-sm font-medium text-gray-500 text-center">
                    {mode === "login" ? (
                        <>
                            {t('global.notRegistered')}?{" "}
                            <button
                                type="button"
                                className="text-blue-700 hover:underline"
                                onClick={() => setMode("register")}
                            >
                                {t('global.createAccount')}
                            </button>
                        </>
                    ) : (
                        <>
                            {t('global.alreadyHaveAccount')}?{" "}
                            <button
                                type="button"
                                className="text-blue-700 hover:underline"
                                onClick={() => setMode("login")}
                            >
                                {t('global.login')}
                            </button>
                        </>
                    )}
                </div>
            </form>
        </GuestLayout>
    );
}
