
import React from 'react';
import {
	Notificacao,
	ToastClose,
	ToastDescription,
	ToastProvider,
	ToastTitle,
	ToastViewport,
} from '@/componentes/ui/notificacao';
import { useToast } from '@/componentes/hooks/useNotificacao';

export function Toaster() {
	const { toasts } = useToast();

	return (
		<ToastProvider>
			{toasts.map(function ({ id, title, description, action, ...props }) {
				return (
					<Notificacao key={id} {...props}>
						<div className="grid gap-1">
							{title && <ToastTitle>{title}</ToastTitle>}
							{description && (
								<ToastDescription>{description}</ToastDescription>
							)}
						</div>
						{action}
						<ToastClose />
					</Notificacao>
				);
			})}
			<ToastViewport />
		</ToastProvider>
	);
}
