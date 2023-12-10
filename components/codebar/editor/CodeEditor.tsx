import React from 'react'
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-sql"
import "ace-builds/src-noconflict/theme-sqlserver";
import "ace-builds/src-noconflict/theme-cobalt"
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/ext-beautify";
import "ace-builds/src-noconflict/ext-searchbox";


type Props = {
  sql: string
}

function CodeEditor({ sql }: Props) {
  // function onChange(value: string, event?: any) {
  //   console.log("change", value);
  // }
  return <AceEditor
    mode="sql"
    theme="cobalt"
    focus
    width={"100%"}
    height={"100%"}
    highlightActiveLine
    navigateToFileEnd
    value={sql}
    // defaultValue={defaultValue}
    // onChange={onChange}
    name="UNIQUE_ID_OF_DIV"
    editorProps={{ $blockScrolling: true, $enableMultiselect: true }}
  />
}
export default CodeEditor