import { Fragment, useState } from "react";

import ShowPage from "../components/showpage/ShowPage";
import Head from "next/head";

const ViewPage = (props) => {
  const [pageData, setPageData] = useState(props.data);
  const [seo, setSeo] = useState(props.data.seo);
  const status = props.status;

  const keywords = JSON.parse(seo.keywords);
  const keysString = keywords.toString();

  return (
    <Fragment>
      <Head>
        <title>{seo.title}</title>
        <meta name="description" content={seo.meta_description} />
        <meta name="keywords" content={keysString} />
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
        <meta name="author" content="توسعه محتوا وب توسکا" />
      </Head>
      <ShowPage secData={pageData} />
    </Fragment>
  );
};

export default ViewPage;

export const getServerSideProps = async (context) => {
  const res = await fetch(`http://api.tooskaweb.com/api/getPage/index`);
  const data = await res.json();
  const status = data.status;
  console.log(res);

  if (status === "page not found") {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      data,
      status,
    },
  };
};
