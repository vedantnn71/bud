var{href:s}=window.location,{width:m,height:v}=window.screen,{userAgent:c,doNotTrack:h}=navigator,{title:d,referrer:a}=document,l=`${m}x${v}`,u=h==="1",{currentScript:r}=document;if(!r)throw new Error("[bud] unable to get the script for bud analytics");var E=r.getAttribute("data-endpoint")??"/api/collect";function y(){let t=new URL(r.getAttribute("src"));return`${t.protocol}//${t.host}`}var L=y(),f=L+E;if(!(typeof window<"u"&&window.document))throw new Error("[bud] stopping the execution as not currently on client side");if(u)throw new Error("[bud] not tracking as do not track is enabled");var p=0,i=!1,x=setInterval(()=>{i||(p+=500)},500);function b(){let t={url:s,visitTime:p,screen:l,referrer:a,userAgent:c,title:d,events:o};fetch(f,{method:"POST",body:JSON.stringify(t)})}document.addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"&&b()});var A=document.querySelectorAll("[data-event]"),o={};function T(t,n,e){t={...t,[e+"ed"]:!0},o={...o,[n]:t}}A.forEach(t=>{let n=t.getAttribute("data-event-name"),e=t.getAttribute("data-event"),g={};!n||!e||t.addEventListener(e,()=>T(g,n,e))});window.addEventListener("blur",async()=>{i=!0});window.addEventListener("focus",async()=>{i=!1});window.addEventListener("beforeunload",async()=>{clearInterval(x)});var w="",R=new MutationObserver(()=>{window.location.href!==w&&(w=window.location.href,b())});R.observe(document,{subtree:!0,childList:!0});
