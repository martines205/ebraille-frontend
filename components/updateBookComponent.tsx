import React, { createContext, useContext, useEffect, useState } from "react";
import { useBookRequest } from "context/BooksContext";
import { createButtonContext, FilterButton, INTERFACE_FILTER_BUTTON, TYPE_BUTTON_CONTEXT } from "./FilterButton";
import { object, string } from "yup";
import { SearchOutlined } from "@mui/icons-material";

const FilterContext = createButtonContext();

interface INTERFACE_SEARCH_CONTEXT {
  title: string;
  // category?: string;
  // language?: string;
}
type TYPE_SEARCH_CONTEXT = [INTERFACE_SEARCH_CONTEXT, React.Dispatch<React.SetStateAction<INTERFACE_SEARCH_CONTEXT>>];
const SearchContext = createContext<TYPE_SEARCH_CONTEXT>([{ title: "" }, () => null]);

export default function UpdateBooks() {
  const { onLoading, filteredBooks, filter, searchBookTitle } = useBookRequest();
  const [button, setButton] = useState<INTERFACE_FILTER_BUTTON>({ onId: "0", filterTypeData: { categoryIs: "", languageIs: "" } });
  const [toSearch, setToSearch] = useState<INTERFACE_SEARCH_CONTEXT>({ title: "" });
  const [dataOfSelectedBooks, setDataOfSelectedBooks] = useState<FORM_INPUT_FILED>({
    TITLE: "",
    AUTHOR: "",
    EDITION: "",
    YEAR: undefined,
    PUBLISHER: "",
    CATEGORY: "",
    LANGUAGE: "",
  });

  useEffect(() => {
    filter({ categories: "", languages: "" });
  }, []);

  useEffect(() => {
    searchBookTitle({ title: toSearch.title });
  }, [toSearch]);

  function onClicked(buttonId: string) {
    const updatedButton = { ...button };
    if (updatedButton.onId === buttonId) {
      updatedButton.onId = "0";
      setButton(updatedButton);
    } else {
      updatedButton.onId = buttonId;
      setTimeout(() => {
        setButton(updatedButton);
      }, 10);
    }
  }

  function onLeave() {
    const updatedButton = { ...button };
    if (updatedButton.onId !== "0") {
      console.log("onLeave: ", "onLeave is true");
      console.log("updatedButton.onId: ", updatedButton.onId);
      updatedButton.onId = "0";
      setButton(updatedButton);
    }
  }

  function onOptionSelected(optionType: string, selected: string) {
    const updatedButtonData = { ...button };
    if (optionType.toUpperCase() === "Category".toUpperCase()) updatedButtonData.filterTypeData.categoryIs = selected;
    else if (optionType.toUpperCase() === "language".toLocaleUpperCase()) updatedButtonData.filterTypeData.languageIs = selected;
    updatedButtonData.onId = "0";
    console.log("updatedButtonData: ", updatedButtonData);
    filter({ categories: updatedButtonData.filterTypeData.categoryIs, languages: updatedButtonData.filterTypeData.languageIs });
    setButton(updatedButtonData);
  }

  function onClear(optionType: string) {
    const updatedButtonData = { ...button };
    if (optionType.toUpperCase() === "Category".toUpperCase()) updatedButtonData.filterTypeData.categoryIs = "";
    else if (optionType.toUpperCase() === "language".toLocaleUpperCase()) updatedButtonData.filterTypeData.languageIs = "";
    setButton(updatedButtonData);
    filter({ categories: updatedButtonData.filterTypeData.categoryIs, languages: updatedButtonData.filterTypeData.languageIs });
  }

  return (
    <SearchContext.Provider value={[toSearch, setToSearch]}>
      <FilterContext.Provider value={[button, { onClear, onOptionSelected, onClicked, onLeave }]}>
        <div className=" w-[97%] h-[88%] bg-white/0 relative top-8 flex gap-4 justify-center" onClick={() => onLeave()}>
          <div className="flex  flex-col w-[50%] h-full border border-blue-400/100 rounded-lg">
            <BookFilter />
            <div className="w-full h-[85%] bg-white/50 p-4 rounded-b-lg">
              <div className="w-full h-[100%]  border border-red-400 rounded-lg bg-black/60 flex flex-wrap p-4 gap-4 overflow-y-auto scrollbar-hide">
                {onLoading ? (
                  <>
                    <h1 className="text-white text-3xl">Loading</h1>
                  </>
                ) : (
                  <>
                    {filteredBooks.map((value, index) => (
                      <div
                        key={index}
                        onClick={(e) => {
                          const index: number = parseInt((e.target as HTMLElement).id);
                          // console.log("booksData: ", filteredBooks[index]);
                          setDataOfSelectedBooks({
                            TITLE: filteredBooks[index].titles,
                            AUTHOR: filteredBooks[index].authors,
                            CATEGORY: filteredBooks[index].categories,
                            EDITION: filteredBooks[index].editions,
                            LANGUAGE: filteredBooks[index].languages,
                            PUBLISHER: "testing",
                            YEAR: filteredBooks[index].year,
                          });
                        }}
                        id={index.toString()}
                        className="w-[230px] h-[300px] bg-slate-50/50 rounded-md hover:border-4 hover:border-yellow-300 mr-3"
                      >
                        {value.titles}
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
          <div className=" w-[45%] h-full border border-yellow-600/0 flex justify-center items-center">
            <FormEdit data={dataOfSelectedBooks} />
            {/* <FormEdit /> */}
          </div>
        </div>
      </FilterContext.Provider>
    </SearchContext.Provider>
  );
}

export function BookFilter() {
  const { onLoading, books } = useBookRequest();
  const [filterContext, _] = useContext(FilterContext);
  const onPresEnter = (e: React.KeyboardEvent) => {
    // const isOnEnter = e.key === "Enter";
    // const value = (e.target as HTMLInputElement).value;
    // if (!isOnEnter || value === "") return;
    // const updatedSearchContextData = { ...searchContextData };
    // searchContextData.title = value;
    // searchContextData.category = filterContext.filterTypeData.categoryIs;
    // searchContextData.language = filterContext.filterTypeData.languageIs;
    // setSearchContextData(searchContextData);
  };
  return (
    <div className="w-full h-[15%] bg-gray-600/30 flex flex-col items-center justify-center gap-3 rounded-t-lg border-b border-b-red-500">
      <SearchBar className="w-4/5 h-[35%] relative" />

      <div className=" flex gap-3 h-[35%]">
        <FilterButton
          booksData={books}
          filterTypeLabel="Category"
          buttonTypeId="1"
          contextSub={FilterContext}
          className="pt-2 pb-2 h-full w-[150px] bg-black text-white  pr-1 rounded-lg relative active:bg-opacity-75 active:scale-105 duration-200"
        />
        <FilterButton
          booksData={books}
          filterTypeLabel="Language"
          buttonTypeId="2"
          contextSub={FilterContext}
          className="pt-2 pb-2 h-full w-[150px] bg-black text-white  pr-1 rounded-lg relative active:bg-opacity-75 active:scale-105 duration-200"
        />
      </div>
    </div>
  );
}

interface FORM_INPUT_FILED {
  TITLE: string;
  AUTHOR: string;
  EDITION: string;
  YEAR: undefined | string;
  PUBLISHER: string;
  CATEGORY: string;
  LANGUAGE: string;
  [key: string]: string | undefined;
}

interface SELECTED_DATA {
  data?: FORM_INPUT_FILED;
}

export function FormEdit(selectedData: SELECTED_DATA) {
  const initialData = selectedData.data;

  const [disabled, setDisabled] = useState(true);
  const [bookData, setBookData] = useState<FORM_INPUT_FILED>({
    AUTHOR: "",
    CATEGORY: "",
    EDITION: "",
    LANGUAGE: "",
    PUBLISHER: "",
    TITLE: "",
    YEAR: "",
  });
  useEffect(() => {
    setBookData({
      AUTHOR: initialData?.AUTHOR || "",
      CATEGORY: initialData?.CATEGORY || "",
      EDITION: initialData?.EDITION || "",
      LANGUAGE: initialData?.LANGUAGE || "",
      PUBLISHER: initialData?.PUBLISHER || "",
      TITLE: initialData?.TITLE || "",
      YEAR: initialData?.YEAR || "",
    });
    if (initialData && !Object.values(initialData).includes("" && undefined)) setDisabled(false);
  }, [initialData]);
  const onChangeHandler = (element: React.FormEvent<HTMLFormElement>) => {
    const updatedBookData: FORM_INPUT_FILED = { ...bookData };
    const keys = Object.keys(updatedBookData);
    const itemId = (element.target as HTMLInputElement).id.split("_").at(-1);
    const value = (element.target as HTMLInputElement).value;
    keys.map((key) => {
      if (key === itemId) {
        updatedBookData[`${key}`] = value;
        setBookData(updatedBookData);
        console.log(updatedBookData[`${key}`]);
      }
    });
  };
  return (
    <form className="bg-black/50 w-[70%] h-[90%] border-2 border-red-500 rounded-xl " onChange={(e) => onChangeHandler(e)}>
      <fieldset className="flex flex-col items-center   w-full h-full  pt-3 pb-3 justify-around" disabled={disabled}>
        <label className="text-white text-sm xl:text-base">TITLE</label>
        <input id="INPUT_FIELD_TITLE" type="text" className=" text-center mb-3 rounded-lg w-[70%] h-[5%] border-2 border-blue-800 focus:outline-blue-400 pl-1 " value={bookData.TITLE} name="" />
        <label className="text-white text-sm xl:text-base">AUTHOR</label>
        <input id="INPUT_FIELD_AUTHOR" type="text" className=" text-center mb-3 rounded-lg w-[70%] h-[5%] border-2 border-blue-800 focus:outline-blue-400 pl-1 " value={bookData.AUTHOR} name="" />
        <label className="text-white text-sm xl:text-base">EDITION</label>
        <input id="INPUT_FIELD_EDITION" type="text" className=" text-center mb-3 rounded-lg w-[70%] h-[5%] border-2 border-blue-800 focus:outline-blue-400 pl-1 " value={bookData.EDITION} name="" />
        <label className="text-white text-sm xl:text-base">YEAR</label>
        <input id="INPUT_FIELD_YEAR" type="number" className="text-center mb-4 rounded-lg p-1" name="" value={bookData?.YEAR} />
        <label className="text-white text-sm xl:text-base">PUBLISHER</label>
        <input
          id="INPUT_FIELD_PUBLISHER"
          type="text"
          className=" text-center mb-3 rounded-lg w-[70%] h-[5%] border-2 border-blue-800 focus:outline-blue-400 pl-1 "
          value={bookData.PUBLISHER}
          name=""
        />
        <label className="text-white text-sm xl:text-base">CATEGORY</label>
        <input id="INPUT_FIELD_CATEGORY" type="text" className=" text-center mb-3 rounded-lg w-[70%] h-[5%] border-2 border-blue-800 focus:outline-blue-400 pl-1 " value={bookData.CATEGORY} name="" />
        <label className="text-white text-sm xl:text-base">LANGUAGE</label>
        <input id="INPUT_FIELD_LANGUAGE" type="text" className=" text-center mb-3 rounded-lg w-[70%] h-[5%] border-2 border-blue-800 focus:outline-blue-400 pl-1 " value={bookData.LANGUAGE} name="" />
        <div className="w-[70%] h-auto flex flex-wrap gap-2 bg-black/0 mb-3 items-center ">
          <label className="text-white text-sm xl:text-base">COVER</label>
          <input className="text-white ml-1 relative " type="file" name="" id="" />
          <label className="text-white text-sm xl:text-base ">BRF File</label>
          <input className="text-white" type="file" name="" id="" />
        </div>
        <button className=" w-auto h-auto p-1 pl-2 pr-2 bg-white rounded-md">Submit</button>
      </fieldset>
    </form>
  );
}

function SearchBar({ className }: any) {
  const [_, setToSearch] = useContext(SearchContext);
  // const [filterData, {}] = useContext(ButtonFilterContext);
  const [title, setTitle] = useState("");
  function onEnterHandler(e: React.KeyboardEvent) {
    const onEnter = e.key === "Enter";
    if (onEnter) {
      setToSearch({ title: title });
      console.log("title: ", title);
    }
  }

  function onClickHandler() {
    if (title === "") return;
    setToSearch({ title: title });
  }

  return (
    <>
      <div className={`${className} w-full h-[35%] flex justify-center relative gap-3`}>
        <div className="w-[60%] h-full relative">
          <input
            className="w-full h-full bg-white bg-opacity-80 rounded-xl  border border-red-500 pl-3 focus:outline-blue-400"
            type="text"
            placeholder="Find..."
            value={title}
            onChange={(e) => {
              // if ((e.target as HTMLInputElement).value === "") setToSearch({ title: "", categories: filterData.filterTypeData.categoryIs, languages: filterData.filterTypeData.languageIs });
              setToSearch({ title: "" });
              setTitle(e.target.value);
            }}
            onKeyDown={(e) => onEnterHandler(e)}
          />
          <div
            className="absolute -right-14 top-0  h-11 w-11 bg-blue-500 text-white  rounded-lg flex items-center justify-center  active:bg-slate-500 hover:scale-105 duration-200"
            onClick={() => onClickHandler()}
          >
            <SearchOutlined className="" fontSize="small" />
          </div>
        </div>
      </div>
    </>
  );
}
