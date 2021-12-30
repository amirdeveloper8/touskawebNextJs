import classes from "./blog.module.css";
import { Markup } from "interweave";

import Button from "../ui/Button";
import Link from "next/link";
import Image from "next/image";

const BlogSection = (props) => {
  const sec = props.sec;
  const posts = props.details.blogs;
  const btn = props.details.button;
  return (
    <section className={classes.blog}>
      <h2>{sec.title}</h2>
      <div className={classes.posts}>
        {posts.map((post, index) => (
          <div key={index} className={classes.post}>
            <Image
              width={550}
              height={350}
              src={post.image_link}
              alt={post.title}
            />
            <h3>{post.title}</h3>
            {/* <Markup content={post.excerpt} /> */}
            <p className="text-center"> ... </p>
            <Button>
              <Link href={post.link}>ادامه مطلب</Link>
            </Button>
          </div>
        ))}
      </div>
      <div className={classes.actions}>
        <Button>
          <Link href={btn.url}>{btn.name}</Link>
        </Button>
      </div>
    </section>
  );
};

export default BlogSection;
