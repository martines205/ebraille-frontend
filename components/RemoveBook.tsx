import React, { createContext, useContext, useEffect, useState } from "react";
import { getAllToken, useBookRequest } from "context/BooksContext";
import { FilterButton, INTERFACE_FILTER_BUTTON, createButtonContext } from "./FilterButton";
import { SearchOutlined } from "@mui/icons-material";
import { title } from "process";
import { apiFetcher } from "@/pages/_app";
import { AxiosError } from "axios";

interface INTERFACE_SEARCH_CONTEXT {
  title: string;
  category?: string;
  language?: string;
}

interface BOOK_DATA {
  ISBN: string;
  TITLE: string;
  AUTHOR: string;
  EDITION: string;
  YEAR: undefined | string;
  PUBLISHER: string;
  CATEGORY: string;
  LANGUAGE: string;
  [key: string]: string | undefined;
}

type TYPE_SEARCH_CONTEXT = [INTERFACE_SEARCH_CONTEXT, React.Dispatch<React.SetStateAction<INTERFACE_SEARCH_CONTEXT>>];
type BOOK_DATA_CONTEXT = [BOOK_DATA, React.Dispatch<React.SetStateAction<BOOK_DATA>>];
const SearchContext = createContext<TYPE_SEARCH_CONTEXT>([{ title: "", category: "", language: "" }, () => null]);
const BookSelectedContext = createContext<BOOK_DATA_CONTEXT>([{ AUTHOR: "", CATEGORY: "", EDITION: "", ISBN: "", LANGUAGE: "", PUBLISHER: "", TITLE: "", YEAR: "" }, () => null]);
const ButtonFilterContext = createButtonContext();

export function RemoveBook() {
  const { onLoading, filteredBooks, filter, searchBookTitle } = useBookRequest();
  const [button, setButton] = useState<INTERFACE_FILTER_BUTTON>({ onId: "0", filterTypeData: { categoryIs: "", languageIs: "" } });
  const [toSearch, setToSearch] = useState<INTERFACE_SEARCH_CONTEXT>({ title: "" });
  const [dataOfSelectedBooks, setDataOfSelectedBooks] = useState<BOOK_DATA>({
    ISBN: "",
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
    <BookSelectedContext.Provider value={[dataOfSelectedBooks, setDataOfSelectedBooks]}>
      <SearchContext.Provider value={[toSearch, setToSearch]}>
        <ButtonFilterContext.Provider value={[button, { onClear, onOptionSelected, onClicked, onLeave }]}>
          <div className=" w-[97%] h-[88%] bg-white/0 relative top-8 flex gap-4 justify-center" onClick={() => onLeave()}>
            <div className="flex  flex-col w-[50%] h-full border border-blue-400/100 rounded-lg">
              <BookFilter />
              <div className="w-full h-[85%] bg-white/50 p-4 rounded-b-lg">
                <div className="w-full h-[100%]  border border-red-400 rounded-lg bg-black/60 flex flex-wrap p-4 overflow-y-auto scrollbar-hide">
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
                            console.log("booksData: ", filteredBooks[index]);
                            setDataOfSelectedBooks({
                              ISBN: filteredBooks[index].isbn,
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
                          className="w-[230px] h-[300px] bg-slate-50/50 rounded-md hover:border-4 hover:border-yellow-300 mr-3 mt-1"
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
              <BookPreview data={dataOfSelectedBooks} />
            </div>
          </div>
        </ButtonFilterContext.Provider>
      </SearchContext.Provider>
    </BookSelectedContext.Provider>
  );
}

export function BookFilter() {
  const { books } = useBookRequest();
  return (
    <div className="w-full h-[15%] bg-gray-600/30 flex flex-col items-center justify-center gap-3 rounded-t-lg border-b border-b-red-500">
      <SearchBar className="w-4/5 h-[35%]   relative" />
      <div className=" flex gap-3 h-[35%]">
        <FilterButton
          booksData={books}
          filterTypeLabel="Category"
          buttonTypeId="1"
          contextSub={ButtonFilterContext}
          className="pt-2 pb-2 h-full w-[150px] bg-black text-white  pr-1 rounded-lg relative active:bg-opacity-75 active:scale-105 duration-200"
        />
        <FilterButton
          booksData={books}
          filterTypeLabel="Language"
          buttonTypeId="2"
          contextSub={ButtonFilterContext}
          className="pt-2 pb-2 h-full w-[150px] bg-black text-white  pr-1 rounded-lg relative active:bg-opacity-75 active:scale-105 duration-200"
        />
      </div>
    </div>
  );
}

interface BOOK_PREVIEW_INTERFACE {
  data: BOOK_DATA;
}

export function BookPreview({ data }: BOOK_PREVIEW_INTERFACE) {
  const { reloadBookData } = useBookRequest();
  const [dataOfSelectedBooks, setDataOfSelectedBooks] = useContext(BookSelectedContext);
  const { AUTHOR, CATEGORY, EDITION, LANGUAGE, PUBLISHER, TITLE, YEAR, ISBN } = dataOfSelectedBooks;
  const [bookISBN, setBookISBN] = useState("");
  const onYesOptionClicked = async () => {
    console.log("ISBN: ", bookISBN);
    try {
      const { accessToken, refreshToken } = getAllToken();
      const response = await apiFetcher.delete("book/deleteBook", { params: { ISBN, accessToken, refreshToken } });
      const dataReset = { ...dataOfSelectedBooks };
      Object.keys(dataReset).map((key) => (dataReset[`${key}`] = ""));
      setDataOfSelectedBooks(dataReset);
      reloadBookData();
      setBookISBN("");
    } catch (error) {
      if (error instanceof AxiosError) console.log("error: ", error.response?.data);
      else console.log("error: ", error);
    }
  };
  const onNoOptionClicked = () => {
    setBookISBN("");
    const dataReset = { ...dataOfSelectedBooks };
    Object.keys(dataReset).map((key) => (dataReset[`${key}`] = ""));
    setDataOfSelectedBooks(dataReset);
  };
  return (
    <>
      <div className="w-[80%] h-[90%] bg-black/80 rounded-lg border-2 border-red-500 relative flex items-center flex-col pt-9">
        <div className="h-80 w-60 border-[3px] border-red-600/60 rounded-r-md rounded-l-3xl bg-blue-700 relative flex">
          <div className="h-full w-[20%] bg-black/70 border-red rounded-l-[21px] " />
          <div className="h-full w-full bg-red-500/0 flex items-center flex-col gap-3 pt-8">
            <div className="w-24 h-24  bg-cover rounded-md ">
              <img src="https://media.tenor.com/ROeaK8Xz1kcAAAAd/jack-sparrow.gif" alt="book Cover" className="rounded-md border-2 border-black" />
            </div>
            <h1 className=" text-black text-lg">{TITLE}</h1>
            <hr className="w-[80%] h-px border-black relative -top-3" />
          </div>
        </div>
        <hr className="w-full h-px border-red-600 mt-9" />
        <div className=" w-full h-[280px] flex flex-wrap justify-center items-center text-white bg-white/30  gap-3 pt-2 overflow-y-auto scrollbar-hide pb-2">
          <div className="w-44 h-20 bg-black/30 border rounded-md flex flex-col justify-center items-center">
            <h1>Title:</h1>
            <p>{TITLE}</p>
          </div>
          <div className="w-44 h-20 bg-black/30 border rounded-md flex flex-col justify-center items-center">
            <h1>Author:</h1>
            <p>{AUTHOR}</p>
          </div>
          <div className="w-44 h-20 bg-black/30 border rounded-md flex flex-col justify-center items-center">
            <h1>Edition:</h1>
            <p>{EDITION}</p>
          </div>
          <div className="w-44 h-20 bg-black/30 border rounded-md flex flex-col justify-center items-center">
            <h1>Publisher:</h1>
            <p>{PUBLISHER}</p>
          </div>
          <div className="w-44 h-20 bg-black/30 border rounded-md flex flex-col justify-center items-center">
            <h1>Language:</h1>
            <p>{LANGUAGE}</p>
          </div>
          <div className="w-44 h-20 bg-black/30 border rounded-md flex flex-col justify-center items-center">
            <h1>Categories:</h1>
            <p>{CATEGORY}</p>
          </div>

          <div className="w-44 h-20 bg-black/30 border rounded-md flex flex-col justify-center items-center">
            <h1>Year:</h1>
            <p>{YEAR}</p>
          </div>
        </div>
        <hr className="w-full h-px border-red-600 " />
        <button className=" w-auto h-auto p-1 pl-2 pr-2 rounded-lg bg-red-600/70 hover:bg-red-600 border border-red-400 text-white mt-6" onClick={() => setBookISBN(ISBN)}>
          Remove
        </button>
        {bookISBN !== "" && (
          <>
            <div className="absolute w-full h-full bg-black/75 left-0 top-0 flex justify-center items-center text-white rounded-lg">
              <div className="h-[22%] w-[75%] bg-white/60 left-0 top-0 flex justify-center items-center text-white flex-col gap-7 rounded-lg border-2 border-red-500">
                <p className="text-black text-xl underline underline-offset-8 font-bold">Are you sure?</p>
                <div>
                  <button className=" w-24 h-auto bg-black/80 pt-2 pb-2 rounded-xl mr-3 hover:bg-white/100 hover:text-red-600" onClick={() => onYesOptionClicked()}>
                    yes
                  </button>
                  <button className=" w-24 h-auto bg-black/80 pt-2 pb-2 rounded-xl hover:bg-white/100 hover:text-green-500" onClick={() => onNoOptionClicked()}>
                    No
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

function SearchBar({ className }: any) {
  const [_, setToSearch] = useContext(SearchContext);
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