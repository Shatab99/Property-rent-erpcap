import { useState } from "react";
import { toastError } from "@/lib/toast";

interface FormDataConfig {
    fileFields: string[];
    requiredFiles?: string[];
}

interface FormDataResult {
    form: FormData;
    bodyData: Record<string, any>;
}

/**
 * Hook to dynamically process form data with file separation
 * @param config Configuration object with file fields and required files
 * @returns Object with processFormData function
 */
export const useFormData = (config: FormDataConfig) => {
    const [loading, setLoading] = useState(false);

    /**
     * Process form element and separate files from JSON data
     * @param formElement HTML form element
     * @returns Object containing FormData and bodyData, or null if validation fails
     */
    const processFormData = (formElement: HTMLFormElement): FormDataResult | null => {
        try {
            const form = new FormData();
            const bodyData: Record<string, any> = {};

            // Get raw form data from the form element
            const rawFormData = new FormData(formElement);

            // Separate JSON and file fields
            Array.from(rawFormData.entries()).forEach(([key, value]) => {
                if (config.fileFields.includes(key)) {
                    // Handle file fields
                    if (value instanceof File && value.size > 0) {
                        form.append(key, value, value.name);
                    }
                } else {
                    // Handle regular fields - add to bodyData
                    bodyData[key] = value;
                }
            });

            // Validate required files if specified
            if (config.requiredFiles && config.requiredFiles.length > 0) {
                const missingFiles = config.requiredFiles.filter(
                    (field) => !form.has(field)
                );

                if (missingFiles.length > 0) {
                    toastError("Please upload all required images", {
                        position: "bottom-center",
                    });
                    return null;
                }
            }

            // Append JSON data as stringified body
            form.append("bodyData", JSON.stringify(bodyData));

            // Log for debugging
            console.log("✅ Form Data:", {
                bodyData,
                files: Array.from(form.keys()),
            });

            return { form, bodyData };
        } catch (error) {
            console.error("Error processing form data:", error);
            toastError("Error processing form data", { position: "bottom-center" });
            return null;
        }
    };

    return {
        processFormData,
        loading,
        setLoading,
    };
};
