const ID2KBART = "https://bacon.abes.fr/id2kbart/";
const KBART_HEAD = '"publication_title"	"print_identifier"	"online_identifier"	"date_first_issue_online"	"num_first_vol_online"	"num_first_issue_online"	"date_last_issue_online"	"num_last_vol_online"	"num_last_issue_online"	"title_url"	"first_author"	"title_id"	"embargo_info"	"coverage_depth"	"notes"	"publisher_name"	"publication_type"	"date_monograph_published_print"	"date_monograph_published_online"	"monograph_volume"	"monograph_edition"	"first_editor"	"parent_publication_title_id"	"preceding_publication_title_id"	"access_type"';

async function baconIdToKbart(id_list,progress_callback,oe=0) {
  let progress_count = 0;
  let errors = [];
  let kbart_lines = [];
  id_list = id_list.filter(e => ((typeof e !== "undefined") && (e != "")));
  id_list = await Promise.all(id_list.map(async (id) => {
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
      if (oe == 1) {
        id.provider = id.provider.sort((a,b) => {
            return (a.name == "OPENEDITION") ? -1:1;
          });
      } else if (oe == 2) {
        id.provider = id.provider.filter((a) => (a.name == "OPENEDITION"));
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
    if (typeof progress_callback === "function") {
      progress_callback(progress_count);
    }
  }));
  kbart_lines.unshift(KBART_HEAD);
  return {errors,kbart_lines};
};
export { baconIdToKbart };
