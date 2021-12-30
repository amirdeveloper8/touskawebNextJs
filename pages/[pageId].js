import { Fragment, useContext, useEffect, useState } from "react";

import AuthContext from "../store/auth-context";

import { getData } from "../lib/get-data";
import ShowPage from "../components/showpage/ShowPage";
import Head from "next/head";

const ViewPage = (props) => {
  const authCtx = useContext(AuthContext);

  const showPage = authCtx.showPage;
  const pageId = props.pageId;

  const [pageData, setPageData] = useState(props.data);
  const [seo, setSeo] = useState(props.data.seo);

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
  const { params } = context;

  const pageId = params.pageId;

  const res = await fetch(`http://api.tooskaweb.com/api/getPage/${pageId}`);
  const data = await res.json();
  const status = data.status;

  if (status === "page not found") {
    return {
      notFound: true,
    };
  }

  if (pageId === "index") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      pageId,
      data,
      status,
    },
  };
};
