/* CONFIGURATION */
const FAST_MODE = false;
const MY_DOMAIN = "somedomain.ru";
const MAIN_PAGE = "dc49b6c7-5689-4b62-9069-491354878409";
const PAGE_TITLE = "Your page title here";
const PAGE_DESCRIPTION = "Your page description here";
const GOOGLE_FONT = "Rubik";
const LOGOTYPE = "https://example.com/custom-logo.png";

// Dictionary for phrase replacements
const PHRASE_REPLACEMENTS = {
    "jjy.fyaadd.cn/api/": MY_DOMAIN, // Replace junk domain with custom domain
    "async function _initializeAnalytics\\(et\,tt\,nt\,it\,ot\,st\,ut\\)": "async function _initializeAnalytics(et,tt,nt,it,ot,st,ut){} async function _initializeAnalyticsKek()", // Disable default analytics
     // Add other replacements as needed
};

/* EVENT LISTENER */
addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event.request));
});

/* REQUEST HANDLER */
async function handleRequest(request) {
    const url = new URL(request.url);

    if (url.pathname == '/') {
        return Response.redirect("https://" + MY_DOMAIN + "/share/" + MAIN_PAGE, 301);
    } else if (url.pathname == '/api/users/me') { //junk request
        return new Response(null, {
            status: 204,
            statusText: 'No Content',
        });
    } else {
        // Handle CORS preflight requests
        if (request.method === "OPTIONS") {
            return new Response(null, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, HEAD, POST, PUT, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                },
            });
        }

        // Proxy requests to the target domain
        url.hostname = "www.buildin.ai";
        let response = await fetch(url.toString(), {
            method: request.method,
            headers: request.headers,
            body: request.body,
        });

        const contentType = response.headers.get("Content-Type");
        if (contentType && contentType.includes("text/html")) {
            response = modifyHTMLResponse(response);
        } else if (contentType && FAST_MODE === false && contentType.includes("application/javascript")) {
            response = modifyJavaScriptResponse(response);
        }
        return response;
    }
}

/* RESPONSE MODIFIERS */
function modifyHTMLResponse(response) {
    return new HTMLRewriter()
        .on("title", new MetaRewriter())
        .on("meta", new MetaRewriter())
        .on("head", new HeadRewriter())
        .on("body", new BodyRewriter())
        .on("script", new ScriptRewriter())
        .transform(response);
}

async function modifyJavaScriptResponse(response) {
    let text = await response.text();
    for (const [original, replacement] of Object.entries(PHRASE_REPLACEMENTS)) {
        text = text.replace(new RegExp(original, 'g'), replacement);
    }
    return new Response(text, {
        headers: response.headers,
    });
}

/* REWRITERS */
class ScriptRewriter { 
    element(element) {
        if (FAST_MODE === false){
            const src = element.getAttribute("src");
            if (src && src.includes("cdn.buildin.ai/assets/")) {
                const newSrc = src.replace("cdn.buildin.ai/assets/", `${MY_DOMAIN}/assets/`);
                element.setAttribute("src", newSrc);
            }
        }
    }
}

class MetaRewriter {
    element(element) {
        if (PAGE_TITLE) {
            if (element.tagName === "title") {
                element.setInnerContent(PAGE_TITLE);
            } else if (
                element.getAttribute("property") === "og:title" ||
                element.getAttribute("name") === "twitter:title"
            ) {
                element.setAttribute("content", PAGE_TITLE);
            }
        }
        if (PAGE_DESCRIPTION) {
            if (
                element.getAttribute("name") === "description" ||
                element.getAttribute("property") === "og:description" ||
                element.getAttribute("name") === "twitter:description"
            ) {
                element.setAttribute("content", PAGE_DESCRIPTION);
            }
        }
    }
}

class HeadRewriter {
    element(element) {
        if (GOOGLE_FONT) {
            element.append(
                `
                <link href="https://fonts.googleapis.com/css?family=${GOOGLE_FONT.replace(" ", "+")}:Regular,Bold,Italic&display=swap" rel="stylesheet"><style>* { font-family: "${GOOGLE_FONT}" !important; }</style>
                `,
                {
                    html: true
                }
            );
        }
    }
}

class BodyRewriter {
    element(element) {
        element.append(
            `<script>
                const updateLogo = () => {
                    //var logo = document.querySelector('a.flex-shrink-0 img');
                    if (logo = document.querySelector('a.flex-shrink-0 img')){
                        logo.src = '${LOGOTYPE}';
                    }else if (logo = document.querySelector('header .flex.items-center img')){
                        logo.src = '${LOGOTYPE}';
                    }
                };

                const observer = new MutationObserver(updateLogo);
                observer.observe(document.body, { childList: true, subtree: true });
            </script>
            `,
            {
                html: true
            }
        );

        element.append(
            `<style>
               .animate-click.text-left.p-1.flex.items-center.justify-center.animate-hover{
                    display: none !important;
                }
               .cursor-pointer.text-t2-medium.flex-shrink-0.bg-white.text-black{
                    display: none !important;
                }
                footer {
                    display:none !important
                }
                .relative.flex.items-center.justify-end.h-full.flex-shrink-0 span.w-px{
                    display:none !important
                }
                button.flex.justify-center.items-center.w-8.h-full:first-child {
                    display: none !important;
                }
                .fixed.bottom-0.w-full.bg-white2.px-4.py-1\\.5.z-50.border-t-\\[0\\.5px\\].border-grey6 {
                    display: none !important;
                }
                .flex.flex-col.justify-center.items-center.py-10.pb-14{
                    display: none !important;
                }
            </style>`,
            {
                html: true
            }
        );
    }
}
