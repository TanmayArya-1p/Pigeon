import { useEffect, useState } from 'react';
import { Outlet } from 'react-router';
import TemplateEditor from '../components/templateEditor';


export function meta({}) {
    return [
      { title: "Pigeon/Create Template" },
      { name: "description", content: "Template Crafter" },
    ];
}



export default function createTemplatePage(props) {
    const [body , setBody] = useState("")
    const [title , setTitle] = useState("")
    const [name , setName] = useState("")
    return <>
        <TemplateEditor text={body} setText={setBody}></TemplateEditor>
    </>
}