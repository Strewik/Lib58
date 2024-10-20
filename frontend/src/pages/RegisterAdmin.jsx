
import AuthForm from '../components/AuthForm';

const RegisterAdmin = () => {
  return (
    <AuthForm route="/api/signup/"  isLogin={false} />
  )
}

export default RegisterAdmin
