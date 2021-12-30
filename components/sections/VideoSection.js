import classes from "./video.module.css";

const VideoSection = (props) => {
  const value = props.sec;
  const data = props.details;

  return (
    <section className={classes.video}>
      <h2>{value.title}</h2>
      {value.subtitle && <p className={classes.subtitle}>{value.subtitle}</p>}
      <div className="h_iframe-aparat_embed_frame">
        <iframe src={data.src} allowFullScreen={true}></iframe>
      </div>
    </section>
  );
};

export default VideoSection;
