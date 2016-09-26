<!--HIT_EXECUTE

BLOB TO DOCUMENT("send_email_post_data_"+String(Milliseconds)+".txt";HTTPD_RequestBody)

_HIT_WebApp_GetFileUploadInfo ("fileupload";"AUTO-PARSE-JSON")
If (JSON Is Valid Object (_HIT_JSON_LONG)=1)
_HIT_HTMLTXT:=JSON Get Text (_HIT_JSON_LONG;"filename")
_HIT_HTMLTXT:=_HIT_HTMLTXT+", "+JSON Get Text (_HIT_JSON_LONG;"extension")
_HIT_HTMLTXT:=_HIT_HTMLTXT+", "+JSON Get Text (_HIT_JSON_LONG;"content-type")
_HIT_HTMLTXT:=_HIT_HTMLTXT+", "+JSON Get Text (_HIT_JSON_LONG;"temppath")
JSON Release (_HIT_JSON_LONG)
_HIT_HTTPD_RedirectToURL ("email_invoice.shtml?fileuploadinfodebug="+_HIT_HTMLTXT+"&field1="+_HIT_WebApp_GetField ("fileupload")+"&field2="+_HIT_WebApp_GetField ("fileupload2"))

Else 

_HIT_HTTPD_RedirectToURL ("email_invoice.shtml?mailto="+_HIT_WebApp_GetField ("mail_to"))

End if

-->