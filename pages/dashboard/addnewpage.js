import AddNew from "../../components/dashboard/AddNew";

import classes from "../../styles/dashboard.module.css";

const AddNewPage = () => {
  const classSection = `dashboard ${classes.addnewpage}`;
  return (
    <section className={classSection}>
      <AddNew />
    </section>
  );
};

export default AddNewPage;
