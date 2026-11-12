import "./LoginForm.css";
import { FormField } from "../FormField";
import { Button } from "../Button";

export const LoginForm = () => {
  return (
    <form className="login-form">
      <FormField label="Email">
        <input />
      </FormField>
      <FormField label="Пароль">
        <input type="password" />
      </FormField>
      <Button>Войти</Button>
    </form>
  );
};
