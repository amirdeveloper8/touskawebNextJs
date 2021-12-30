import React, { Component } from "react";
import { convertFromRaw, convertToRaw, EditorState } from "draft-js";
import dynamic from "next/dynamic";
const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);

import { stateFromHTML } from "draft-js-import-html";
import { stateToHTML } from "draft-js-export-html";
import "../../node_modules/draft-js/dist/Draft.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

function uploadImageCallBack(file) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.imgur.com/3/image");
    xhr.setRequestHeader("Authorization", "Client-ID XXXXX");
    const data = new FormData();
    data.append("image", file);
    xhr.send(data);
    xhr.addEventListener("load", () => {
      const response = JSON.parse(xhr.responseText);
      resolve(response);
    });
    xhr.addEventListener("error", () => {
      const error = JSON.parse(xhr.responseText);
      reject(error);
    });
  });
}

class EditorContainer extends Component {
  constructor(props) {
    let datas;

    if (props.updateValue) {
      // const blocksFromHtml = htmlToDraft(props.updateValue);
      // const { contentBlocks, entityMap } = blocksFromHtml;
      datas = stateFromHTML(props.updateValue);
      // const { contentBlocks, entityMap } = contentValue;
      // datas = ContentState.createFromBlockArray(contentBlocks, entityMap);
    }
    super(props);
    if (!datas) {
      this.state = { editorState: EditorState.createEmpty() };
    } else {
      this.state = {
        editorState: EditorState.createWithContent(datas),
      };
    }
  }

  onEditorStateChange = (editorState) => {
    // console.log(editorState)
    this.setState({
      editorState,
    });
  };

  render() {
    const { editorState } = this.state;

    const blurHandler = () => {
      //   const rawContentState = convertToRaw(editorState.getCurrentContent());
      //   const value = draftToHtml(rawContentState);
      let options = {
        inlineStyles: {
          // Override default element (`strong`).
          BOLD: { element: "b" },
          ITALIC: {
            // Add custom attributes. You can also use React-style `className`.
            attributes: { class: "foo" },
            // Use camel-case. Units (`px`) will be added where necessary.
            style: { fontSize: 12 },
          },
          // Use a custom inline style. Default element is `span`.
          RED: { style: { color: "#900" } },
        },
      };
      let html = stateToHTML(editorState.getCurrentContent(), options);
      //   this.props.getTexts(value);
      const contentState = editorState.getCurrentContent();
      const entityKeys = Object.keys(convertToRaw(contentState).entityMap);
      const val = convertToRaw(contentState, options);
      console.log("val", html);
      this.props.getTexts(html);
    };
    return (
      <div className="editor">
        <Editor
          editorState={editorState}
          onEditorStateChange={this.onEditorStateChange}
          onBlur={blurHandler}
          toolbar={{
            inline: { inDropdown: true },
            list: { inDropdown: true },
            textAlign: { inDropdown: true },
            link: { inDropdown: true },
            history: { inDropdown: true },
            image: {
              uploadCallback: uploadImageCallBack,
              alt: { present: true, mandatory: true },
            },
          }}
        />
      </div>
    );
  }
}

const NewRich = (props) => {
  return (
    <EditorContainer
      updateValue={props.updateValue}
      getTexts={props.getTexts}
    />
  );
};

export default NewRich;
