import Link from 'next/link';
import { ReactNode } from 'react';

type Props = {
    title: string;
    subtitle?: string;
    children: ReactNode;
};

export function LayoutShell({ title, subtitle, children }: Props) {
    return (
        <div className='min-h-screen'>
            <header className='border-b bg-white'>
                <div className="mx-auto flex max-w-7x1 items-center justify-between px-6 py-4">
                    <div>
                        <p className='text-sm font-semibold text-slate-600'>LogOps</p>
                        <h1 className='text-xl font-bold text-slate-900'>Exception Monitoring</h1>
                    </div>
                    <nav className='flex gap-4 text-sm font-medium text-slate-600'>
                        <Link href='/' className='hover:text-slate-900'>Overview</Link>
                        <Link href='/exceptions' className='hover:text-slate-900'>Exception Queue</Link>
                    </nav>
                </div>
            </header>

            <main className='mx-auto max-w-7x1 px-6 py-8'>
                <div className='mb-8'>
                    <h2 className='text-2x1 font-bold text-slate-900'>{title}</h2>
                    {subtitle ? <p className='mt-1 text-sm text-slate-500'>{subtitle}</p> : null}
                </div>
                {children}
            </main>
        </div>
    );
}