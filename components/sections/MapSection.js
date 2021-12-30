import classes from "./map.module.css";

const MapSection = (props) => {
  const data = props.details;
  return (
    <section className={classes.map}>
      <iframe src={data.src} width="100%" height="450" loading="lazy"></iframe>
    </section>
  );
};

export default MapSection;
