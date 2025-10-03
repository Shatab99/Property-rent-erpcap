import { toast } from "sonner"

export const toastSuccess = (message: string, options?: {
    position?: "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right",
    richColors?: boolean,
    props?: Record<string, any>
}) => {
    const { position = "top-center", richColors = true, ...props } = options || {};
    toast.success(message, { richColors, position, ...props });
}

export const toastError = (
    message: string,
    options?: {
        position?: "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right",
        richColors?: boolean,
        props?: Record<string, any>
    }
) => {
    const { position = "top-center", richColors = true, ...props } = options || {};
    toast.error(message, { richColors, position, ...props });
}