import classes from "../styles/allpages.module.css";

const NotFound = () => {
  return (
    <section className={classes.notFound} dir="rtl">
      <h1 className="text-center">404</h1>
      <h2 className="text-center">صفحه مورد نظر پیدا نشد!</h2>
    </section>
  );
};

export default NotFound;
