const ID2KBART = "https://bacon.abes.fr/id2kbart/";
const PKG2KBART = "https://bacon.abes.fr/package2kbart/";
const KBART_HEAD = '"publication_title"	"print_identifier"	"online_identifier"	"date_first_issue_online"	"num_first_vol_online"	"num_first_issue_online"	"date_last_issue_online"	"num_last_vol_online"	"num_last_issue_online"	"title_url"	"first_author"	"title_id"	"embargo_info"	"coverage_depth"	"notes"	"publisher_name"	"publication_type"	"date_monograph_published_print"	"date_monograph_published_online"	"monograph_volume"	"monograph_edition"	"first_editor"	"parent_publication_title_id"	"preceding_publication_title_id"	"access_type"';
function output(filename, data, type) {
  var a = window.document.createElement('a');
  a.setAttribute("target","_blank");
  a.href = window.URL.createObjectURL(new Blob([data], {type: type}));
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
document.querySelector("#validate").addEventListener("click", async (event) => {
  event.target.setAttribute("disabled",true);
  let userInput = document.querySelector("textarea").value;
  let progress = document.querySelector("progress");
  let progress_count = 0;
  let errors = [];
  let kbart_lines = [];
  userInput = userInput.split(/,|;|\n/);
  progress.setAttribute("max",userInput.length);
  userInput = userInput.filter(e => ((typeof e !== "undefined") && (e != "")));
  userInput = await Promise.all(userInput.map(async (id) => {
    id = await fetch(ID2KBART+id+".json");
    id = await id.json();
    id = id.query;
    try {
      id.provider.map(e => {
        if (Array.isArray(e.kbart)) {
          e.kbart.map(k => {
            let provider_copy = {};
            provider_copy = Object.assign(provider_copy,e);
            provider_copy.kbart = k;
            id.provider.push(provider_copy);
          });
        }
      });
      id.provider = id.provider.filter(e => (!Array.isArray(e.kbart)));
      id.provider = id.provider.sort((a,b) =>
        a.kbart.access_type.localeCompare(b.kbart.access_type));
      if (document.querySelector("#OE").checked) {
        id.provider = id.provider.sort((a,b) => {
            return (a.name == "OPENEDITION") ? -1:1;
          });
      }
      let kbart = "";
      KBART_HEAD.split("\t").map(e => {
        kbart += (kbart.length != 0) ? "\t":"";
        let value = id.provider[0].kbart[e.replace(/"/g,"")];
        kbart += (typeof value === "string") ? value:"";
      });
      kbart_lines.push(kbart);
    } catch {
      errors.push(id.id);
      console.warn("not found: "+id.id);
    }
    progress_count++;
    progress.setAttribute("value",progress_count);
  }));
  kbart_lines.unshift(KBART_HEAD);
  event.target.removeAttribute("disabled");
  document.querySelector("textarea").value = "";
  if (errors.length == progress_count) {
    alert("Pas de résultat :(");
  } else {
    output("bacon_data.tsv",kbart_lines.join("\n"),"text/tab-separated-values");
  }
  if (errors.length > 0) {
    let errors_log = (document.querySelector("pre")
    || document.createElement("pre"));
    errors = "Identifiants non trouvés:\n"+errors.join("\n");
    errors_log.innerText = errors;
    document.querySelector("main").append(errors_log);
  }
});