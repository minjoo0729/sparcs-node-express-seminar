import React from "react";
import axios from "axios";
import { SAPIBase } from "../tools/api";
import "./css/feed.css";

interface IAPIResponse  { id: number, title: string, content: string }
interface Prop { val: IAPIResponse, Test: any, setTest: any}

const PostEdit = ({ val, Test, setTest }: Prop) => {
  const [SEditTitle, setSEditTitle] = React.useState<string>("");
  const [SEditContent, setSEditContent] = React.useState<string>("");

  const editThePost = (id: string) => {
    const asyncFun = async () => {
      await axios.post( SAPIBase + '/feed/editFeed', { id: id, title: SEditTitle, content: SEditContent} );
      setSEditTitle("");
      setSEditContent("");
      setTest(!Test);
    }
    asyncFun().catch(e => window.alert(`AN ERROR OCCURED! ${e}`));
  }

  return (
    <div>
      Title: <input type={"text"} value={SEditTitle} onChange={(e) => setSEditTitle(e.target.value)}/>
      &nbsp;
      &nbsp;
      &nbsp;
      &nbsp;
      Content: <input type={"text"} value={SEditContent} onChange={(e) => setSEditContent(e.target.value)}/>
      <div className={"post-edit-button"} onClick={(e) => editThePost(`${val.id}`)}>Edit Post!</div>
    </div>
  );
}

export default PostEdit;