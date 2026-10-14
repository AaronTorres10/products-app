import { router } from "expo-router";
import { useRef, useState } from "react";
import type {
    AuthField,
    RegisterInput,
} from "../../../core/auth/actions/auth-actions";
import { useAuthStore } from "../store/useAuthStore";
import { FieldErrors, validateAuth } from "../utils/validate-auth";
export function useAuthForm(isRegister: boolean) {
  const [form, setForm] = useState<RegisterInput>({
    fullName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const posting = useRef(false);
  const updateField = (field: AuthField, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setMessage("");
  };
  const submit = async () => {
    if (posting.current) return;
    const nextErrors = validateAuth(form, isRegister);
    setErrors(nextErrors);
    setMessage("");
    if (Object.keys(nextErrors).length) return;
    posting.current = true;
    setIsPosting(true);
    try {
      const store = useAuthStore.getState();
      const result = isRegister
        ? await store.register(form)
        : await store.login(form.email, form.password);
      if (result.ok) router.replace("/");
      else if (result.field) setErrors({ [result.field]: result.message });
      else setMessage(result.message);
    } catch {
      setMessage("No pudimos completar la solicitud. Intenta nuevamente.");
    } finally {
      posting.current = false;
      setIsPosting(false);
    }
  };
  return { form, errors, message, isPosting, updateField, submit };
}
