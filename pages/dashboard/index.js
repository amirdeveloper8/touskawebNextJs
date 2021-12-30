import Cookies from "js-cookie";

const Dashboard = () => {
  const username = Cookies.get("username");
  return (
    <section className="dashboard">
      <h1>Dashboard Page {username}</h1>
    </section>
  );
};

export async function getServerSideProps(ctx) {
  const cookie = ctx.req.headers.cookie;
  //   const cookie2 = cookie.split(",");
  const session = cookie.includes("token");

  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

export default Dashboard;
