import { Fragment, useContext, useEffect, useState } from "react";
import AuthContext from "../../../store/auth-context";

import UpdateDetails from "../../../components/dashboard/UpdateDetails";

const Seo = (props) => {
  const authCtx = useContext(AuthContext);

  const showPage = authCtx.showPage;

  const [pageData, setPageData] = useState();

  const [title, setTitle] = useState(props.data.page.title);
  const [desc, setDesc] = useState(props.data.page.excerpt);
  const [url, setUrl] = useState(props.data.page.url);

  const [meta, setMeta] = useState(props.data.seo.meta_description);
  const [seoTitle, setSeoTitle] = useState(props.data.seo.title);
  const [keys, setKeys] = useState(props.data.seo.keywords);

  const pageId = props.pageId;

  console.log(pageData);
  return (
    <section className="dashboard">
      {showPage && (
        <UpdateDetails
          title={title}
          desc={desc}
          meta={meta}
          url={url}
          seoTitle={seoTitle}
          keys={keys}
          data={pageData}
          pageId={pageId}
        />
      )}
    </section>
  );
};

export default Seo;

export const getServerSideProps = async (context) => {
  const { params } = context;

  const pageId = params.pageId;

  const res = await fetch(`http://api.tooskaweb.com/api/getPage/${pageId}`);
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
      pageId,
      data,
      status,
    },
  };
};
