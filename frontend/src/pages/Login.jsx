import AdminForm from "../components/AdminForm"

const Login = () => {
  return (
    <AdminForm route="/api/token/" method="login" />
  )
}

export default Login