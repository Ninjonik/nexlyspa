import {toast, ToastOptions} from "react-toastify";

const fireToast = (type: "info" | "success" | "warning" | "error" | "default" = "info", text: string = "", textPosition: "top-left" | "top-right" | "top-center" | "bottom-left" | "bottom-right" | "bottom-center" = "top-right", closeAfter: number = 1500) => {

    const options: ToastOptions = {
        position: textPosition,
        autoClose: closeAfter,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    }

    switch (type) {
        case "info":
            toast.info(text, options);
            break
        case "success":
            toast.success(text, options);
            break
        case "warning":
            toast.warning(text, options);
            break
        case "error":
            toast.error(text, options);
            break
        case "default":
            toast(text, options);
            break
    }
}

export default fireToast;