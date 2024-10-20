






// import AdminForm from "../components/AdminForm"
import AuthForm from '../components/AuthForm';

const Login = () => {
  return (
    <AuthForm route="/api/token/" isLogin={true} />
  )
}

export default Login

