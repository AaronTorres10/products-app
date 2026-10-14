import type {
    AuthField,
    RegisterInput,
} from "../../../core/auth/actions/auth-actions";
export type FieldErrors = Partial<Record<AuthField, string>>;
export function validateAuth(
  form: RegisterInput,
  isRegister: boolean,
): FieldErrors {
  const errors: FieldErrors = {};
  if (isRegister && !form.fullName.trim())
    errors.fullName = "Ingresa tu nombre completo.";
  if (!form.email.trim()) errors.email = "Ingresa tu correo.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
    errors.email = "Ingresa un correo válido.";
  if (!form.password) errors.password = "Ingresa tu contraseña.";
  else if (
    isRegister &&
    (form.password.length < 5 || form.password.length > 10)
  )
    errors.password = "La contraseña debe tener entre 5 y 10 caracteres.";
  else if (
    isRegister &&
    (!/[A-Z]/.test(form.password) ||
      !/[a-z]/.test(form.password) ||
      !/[0-9]/.test(form.password))
  )
    errors.password =
      "Incluye al menos una mayúscula, una minúscula y un número.";
  return errors;
}
