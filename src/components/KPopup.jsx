// Author : Loay Mahmoud <loay@klenka.com>
//
// Documentaion URL
// https://v4.chameleoni.com/Documentation/popup.aspx
//

import { useState, useRef, forwardRef, useCallback } from "react";
import { FaWindowRestore, FaXmark } from "react-icons/fa6";
import { BsExclamationCircle } from "react-icons/bs";

import "./KPopup.css";

let popupArray = [];
const popSlotKeys = Array(20).fill("");
const popSlotRefresher = Array(20);
const popSlotObjects = Array(20);
const popMinSlots = ["", "", "", "", ""];
const popMinSlotWidth = 250;
const initialZIndex = 15000;
const topMostZIndexPlus = 2000;
const hdrHeight = 40;
const ftrHeight = 53;
const ftrBtnHeight = 37;
const ftrStyle = { height: ftrHeight, paddingTop: 8 };
const loaderStyle = { display: "none", position: "absolute", left: 0, right: 0, top: hdrHeight, bottom: 0, backgroundColor: "rgba(230,230,230,0.5)" };
const cnstClosedBy = { code: "code", outsideCode: "outsideCode", footerButton: "footerButton", closer: "closer", autoHide: "autoHide" };

const MyVars = {};

const propsDefaults = {
  alwaysRespond: false,
  modal: true,
  closeButton: true,
  maxButton: false,
  minButton: false,
  position: "center",
  movable: true,
  topMost: false,
  key: "",
  header: "",
  footer: null,
  hideAfter: 0,
  animation: "PopEase",
  resizable: true,
  showHeader: true,
  footerCentered: false,
  drawer: false,
  drawerPosition: "right",
};

function setHdrStyle(PopupProps) {
  if (PopupProps.showHeader) {
    PopupProps.hdrStyle = { height: hdrHeight, paddingTop: 6 };
    if (PopupProps.movable) PopupProps.hdrStyle.cursor = "grab";
  } else {
    PopupProps.hdrStyle = { height: hdrHeight, display: "none" };
  }
}

function setCntStyle(PopupProps) {
  if (PopupProps.showHeader) {
    PopupProps.cntStyle = { top: hdrHeight, bottom: 0 };
  } else {
    PopupProps.cntStyle = { top: 0, bottom: 0 };
  }

  if (PopupProps.footer) PopupProps.cntStyle.bottom = ftrHeight;
}

function resetZIndex() {
  MyVars.PopupMaxZIndex = initialZIndex;
}

export const closePopup = async (Key, Respond) => {
  var currPop = popupArray.find((item) => item.Key == Key);
  if (currPop) publicClosePopup(Key, Respond, currPop, cnstClosedBy.outsideCode);
};

export const openPopup = (Component, ComponentProps = {}, PopupProps = {}, Responder) => {
  if (PopupProps.key) {
    var Key = PopupProps.key;
    var currPop = popupArray.find((item) => item.Key == Key);
    if (currPop) {
      if (popMinSlots.includes(Key)) {
        currPop.minimizeClicked();
      } else {
        currPop.switchToTop("hdrMouseDnEvent");
      }
      return;
    }
  } else {
    var Key = Math.random().toString(36).replace("0.", "pop");
    PopupProps.key = Key;
  }

  var slotId = popSlotKeys.indexOf("");
  if (slotId == -1) {
    alert("Too many popups are opened, please close some of them");
    return;
  }

  if (!MyVars.PopupMaxZIndex) resetZIndex();
  PopupProps = {
    ...propsDefaults,
    ...Component.defaults,
    ...PopupProps,
    ...Component.forcedDefualts,
  };
  publicSwitchToTop(null, PopupProps);
  if (PopupProps.owner && PopupProps.topMost !== true && PopupProps.modal !== true) {
    var myOwnerObject = popupArray.find((item) => item.Key == PopupProps.owner);
    if (myOwnerObject?.PopupProps?.topMost === true || myOwnerObject?.PopupProps?.modal === true) {
      // if my owner is top most then switch me to top most
      PopupProps.topMost = true;
    }
  }
  if (Array.isArray(PopupProps.size)) {
    PopupProps.width = PopupProps.size[0];
    PopupProps.height = PopupProps.size[1];
  }
  if (PopupProps.size == "full") {
    PopupProps.width = window.innerWidth - 20;
    PopupProps.height = window.innerHeight - 20;
  }
  if (PopupProps.size == "large") {
    PopupProps.width = parseInt(window.innerWidth * 0.8);
    PopupProps.height = parseInt(window.innerHeight * 0.9);
  }

  if (PopupProps.size == "long") {
    PopupProps.width = parseInt(window.innerWidth * 0.5);
    PopupProps.height = parseInt(window.innerHeight * 0.9);
  }

  if (PopupProps.size == "long60") {
    PopupProps.width = parseInt(window.innerWidth * 0.6);
    PopupProps.height = parseInt(window.innerHeight * 0.9);
  }

  if (PopupProps.size == "long70") {
    PopupProps.width = parseInt(window.innerWidth * 0.7);
    PopupProps.height = parseInt(window.innerHeight * 0.9);
  }

  if (PopupProps.size == "long80") {
    PopupProps.width = parseInt(window.innerWidth * 0.8);
    PopupProps.height = parseInt(window.innerHeight * 0.9);
  }

  if (PopupProps.size == "big") {
    PopupProps.width = parseInt(window.innerWidth * 0.7);
    PopupProps.height = parseInt(window.innerHeight * 0.8);
  }

  if (PopupProps.size == "medium") {
    PopupProps.width = parseInt(window.innerWidth * 0.6);
    PopupProps.height = parseInt(window.innerHeight * 0.7);
  }
  if (PopupProps.size == "small") {
    PopupProps.width = 500;
    PopupProps.height = 300;
  }
  if (PopupProps.size == "small+") {
    PopupProps.width = 550;
    PopupProps.height = 350;
  }
  if (PopupProps.size == "small+wide+") {
    PopupProps.width = 700;
    PopupProps.height = 350;
  }
  if (PopupProps.size == "tiny") {
    PopupProps.width = 400;
    PopupProps.height = 200;
  }

  //big is default
  if (!PopupProps.width) PopupProps.width = parseInt(window.innerWidth * 0.7);
  if (!PopupProps.height) PopupProps.height = parseInt(window.innerHeight * 0.8);

  if (PopupProps.width > window.innerWidth - 20) PopupProps.width = window.innerWidth - 20;
  if (PopupProps.height > window.innerHeight - 20) PopupProps.height = window.innerHeight - 20;

  // Handle drawer mode
  if (PopupProps.drawer) {
    PopupProps.movable = false;
    PopupProps.resizable = false;
    PopupProps.minButton = false;
    PopupProps.maxButton = false;

    const drawerPos = PopupProps.drawerPosition || "right";
    PopupProps.height = window.innerHeight;

    if (!PopupProps.width) {
      PopupProps.width = Math.min(500, parseInt(window.innerWidth * 0.9));
    }

    PopupProps.popStyle = {
      width: PopupProps.width,
      height: PopupProps.height,
      top: 0,
      bottom: 0,
    };

    if (drawerPos === "right") {
      PopupProps.popStyle.right = 0;
      PopupProps.animation = "PopSlideRight";
    } else if (drawerPos === "left") {
      PopupProps.popStyle.left = 0;
      PopupProps.animation = "PopSlideLeft";
    } else if (drawerPos === "top") {
      PopupProps.height = Math.min(600, parseInt(window.innerHeight * 0.8));
      PopupProps.width = window.innerWidth;
      PopupProps.popStyle.width = window.innerWidth;
      PopupProps.popStyle.height = PopupProps.height;
      PopupProps.popStyle.top = 0;
      PopupProps.popStyle.left = 0;
      delete PopupProps.popStyle.bottom;
      PopupProps.animation = "PopSlideDown";
    } else if (drawerPos === "bottom") {
      PopupProps.height = Math.min(600, parseInt(window.innerHeight * 0.8));
      PopupProps.width = window.innerWidth;
      PopupProps.popStyle.width = window.innerWidth;
      PopupProps.popStyle.height = PopupProps.height;
      PopupProps.popStyle.bottom = 0;
      PopupProps.popStyle.left = 0;
      delete PopupProps.popStyle.top;
      PopupProps.animation = "PopSlideUp";
    }
  } else {
    // Normal popup positioning
    PopupProps.popStyle = {
      left: (window.innerWidth - PopupProps.width) / 2,
      top: (window.innerHeight - PopupProps.height) / 2,
      width: PopupProps.width,
      height: PopupProps.height,
    };

    PopupProps.position = `${PopupProps.position}`.toLowerCase();

    if (PopupProps.position.includes("top")) PopupProps.popStyle.top = 10;
    if (PopupProps.position.includes("left")) PopupProps.popStyle.left = 10;
    if (PopupProps.position.includes("right")) PopupProps.popStyle.left = window.innerWidth - PopupProps.width - 10;
  }

  setHdrStyle(PopupProps);
  setCntStyle(PopupProps);

  // Modal style will be populated with z-index later by publicSwitchToTop
  PopupProps.modalStyle = { position: "fixed", left: 0, right: 0, top: 0, bottom: 0 };

  if (!PopupProps.drawer) {
    if (PopupProps.position.includes("bottom")) PopupProps.popStyle.top = window.innerHeight - PopupProps.height - 10;
    if (PopupProps.popStyle.top < 0) PopupProps.popStyle.top = 0;
  }

  PopupProps.vars = {};

  var popupObject = { Key: Key, Component: Component, ComponentProps: ComponentProps, PopupProps: PopupProps, Responder: Responder };
  popupObject.cacheChecked = {};
  popupObject.cacheDdlValue = {};
  popupObject.cacheVisibleStatus = {};

  activeKey = Key;
  activePopupObject = popupObject

  if (Component !== "html" && Component !== "HTML") {
    ComponentProps.popup = {
      key: Key,
      timestamp: new Date().getTime(),
      close: (respond) => {
        publicClosePopup(Key, respond, popupObject, cnstClosedBy.code);
      },
      setHeader: (header) => {
        PopupProps.header = header;
        if (popupObject.setHeaderRefresher) {
          popupObject.setHeaderRefresher((old) => old + 1);
        } else {
          PopupProps.setRefresher((old) => old + 1);
        }
      },
      setFooter: (newArray) => {
        if (typeof newArray === "string") {
          var newArray = [{ text: newArray }];
        }
        var oldArray = PopupProps.footer;
        PopupProps.footer = newArray;
        if (Array.isArray(oldArray) && Array.isArray(newArray) && popupObject.setFooterRefresher) {
          popupObject.setFooterRefresher((old) => old + 1);
        } else {
          setCntStyle(PopupProps);
          PopupProps.setRefresher((old) => old + 1);
        }
      },
      footerButtonOnClick: null,
      onClose: null,
      getFooterChecked: (nm) => {
        return popupObject.cacheChecked[nm];
      },
      getFooterDdlValue: (nm) => {
        return popupObject.cacheDdlValue[nm];
      },
      setFooterDdlValue: (nm, value) => {
        popupObject.cacheDdlValue[nm] = String(value);
        if (Array.isArray(PopupProps.footer) && popupObject.setFooterRefresher) {
          popupObject.setFooterRefresher(old => old + 1);
        }
      },
      setFooterChecked: (nm, value) => {
        popupObject.cacheChecked[nm] = value ? true : false;
        if (Array.isArray(PopupProps.footer) && popupObject.setFooterRefresher) {
          popupObject.setFooterRefresher(old => old + 1);
        }
      },
      setElementShowHide: (nm, value) => {
        popupObject.cacheVisibleStatus[nm] = Boolean(value);
        if (Array.isArray(PopupProps.footer) && popupObject.setFooterRefresher) {
          popupObject.setFooterRefresher(old => old + 1);
        }
      },
      scrollToBottom: () => {
        var bd = popupObject.bodyRef?.current
        if (bd) bd.scrollTo({ top: bd.scrollHeight, behavior: "smooth" });
      },
      scrollToTop: () => {
        var bd = popupObject.bodyRef?.current
        if (bd) bd.scrollTo({ top: 0, behavior: "smooth" });
      },
      showLoader: () => {
        var loader = popupObject.popRef?.current?.querySelector(":scope > div.PopLoader");
        if (loader) loader.style.display = "block";
      },
      hideLoader: () => {
        var loader = popupObject.popRef.current.querySelector(":scope > div.PopLoader");
        if (loader) loader.style.display = "none";
      },
      autoLoader: (isLoading, isError) => {
        if (typeof isLoading == "boolean") isLoading = [isLoading];
        if (typeof isError == "boolean") isError = [isError];
        if (!Array.isArray(isLoading)) isLoading = [];
        if (!Array.isArray(isError)) isError = [];
        if (isError.find((value) => value == true)) {
          ComponentProps.popup.hideLoader();
          return;
        }
        if (isLoading.find((value) => value == true)) {
          ComponentProps.popup.showLoader();
          return;
        }
        ComponentProps.popup.hideLoader();
      },
      hold: (mSeconds = 1000) => {
        if (mSeconds > 0) {
          if (mSeconds > 10000) mSeconds = 10000;
          popupObject.isHeld = true;
          setTimeout(() => {
            popupObject.isHeld = false;
          }, mSeconds);
        } else {
          popupObject.isHeld = false;
        }
      },
      openChildPopup: (theComponent, theComponentProps, thePopupProps, theResponder) => {
        thePopupProps.owner = Key;
        if (thePopupProps.key) thePopupProps.key = Key + "-child-" + thePopupProps.key;
        openPopup(theComponent, theComponentProps, thePopupProps, theResponder);
      },
    };
  }

  popupArray.push(popupObject);

  var slotId = popSlotKeys.indexOf("");
  popSlotKeys[slotId] = Key;
  popSlotObjects[slotId] = popupObject;
  popSlotRefresher[slotId]((old) => old + 1);

  if (PopupProps.hideAfter > 0) {
    setTimeout(function () {
      publicClosePopup(Key, null, popupObject, cnstClosedBy.autoHide);
    }, PopupProps.hideAfter);
  }
};

const publicClosePopup = async (Key, Respond, popupObject, closedBy) => {
  var fnOnClose = popupObject.ComponentProps?.popup?.onClose;
  if (fnOnClose) {
    var msg = { cancel: false, respond: Respond, closedBy: closedBy };
    await fnOnClose(msg);
    if (msg.cancel === true) {
      return;
    }
    if (msg.respond !== Respond) {
      Respond = msg.respond;
    }
  }

  var alwaysRespond = popupObject.PopupProps?.alwaysRespond;

  if ((Respond || alwaysRespond) && popupObject.Responder) {
    setTimeout(() => {
      popupObject.Responder(Respond, closedBy);
    }, 100);
  }

  if (MyVars.PopupTopOne == Key) MyVars.PopupTopOne = "";
  if (MyVars.PopupTopOneOwner == Key) MyVars.PopupTopOneOwner = "";

  popupArray.forEach((item) => {
    if (item.Key === Key || item.PopupProps?.owner === Key) {
      var slotIx = popMinSlots.indexOf(item.Key);
      if (slotIx > -1) popMinSlots[slotIx] = "";
    }
  });
  // clean the array
  popupArray = popupArray.filter((item) => !(item.Key === Key || item.PopupProps?.owner === Key));
  if (popupArray.length == 0) resetZIndex();

  activeKey = null
  activePopupObject = null

  // who is the top most now
  var step = 0;
  popupArray.forEach((item) => {

    if  (item.Key == Key) return; // skip me

    if (item.PopupProps.modal || item.PopupProps.topMost) {
      step = topMostZIndexPlus
    } else {
      step = 0
    }

    if (!activeKey) {
      activeKey = item.Key;
      activePopupObject = item;
      activeStep = step;
    } else {
      if ((item.PopupProps.popZindex+step) > (activePopupObject.PopupProps.popZindex+activeStep)) {
        activeKey = item.Key;
        activePopupObject = item;
        activeStep = step;
      }
    }
  })

  popSlotKeys.forEach((slotKey, slotIx) => {
    if (slotKey) {
      var objExist = popupArray.find((popObj) => popObj.Key == slotKey);
      if (!objExist) {
        var theOldPop = popSlotObjects[slotIx];
        if (theOldPop) {
          theOldPop.isHeld = true;
          if (theOldPop.popRef && theOldPop.popRef.current) {
            theOldPop.popRef.current.classList.add("PopEaseOut");
          }
          try {
            if (theOldPop.modalRef && theOldPop.modalRef.current) {
              theOldPop.modalRef.current.classList.add("PopEase60Out");
            }
          } catch { }
          setTimeout(() => {
            popSlotKeys[slotIx] = ""; // clean the slot
            popSlotObjects[slotIx] = null;
            popSlotRefresher[slotIx]((old) => old + 1);
          }, 260);
        }
      }
    }
  });
};

function escCloseFnc(event) {
  if (event.key === 'Escape' || event.key === 'Esc') {
    if (activeKey && activePopupObject) {
      publicClosePopup(activeKey, null, activePopupObject, cnstClosedBy.closer);
    }
  }
}

export const PopupContainer = (props) => {
  document.addEventListener('keydown', escCloseFnc);
  return (
    <div className="POP_CONTAINER">
      <PopSlot slotId={0} />
      <PopSlot slotId={1} />
      <PopSlot slotId={2} />
      <PopSlot slotId={3} />
      <PopSlot slotId={4} />
      <PopSlot slotId={5} />
      <PopSlot slotId={6} />
      <PopSlot slotId={7} />
      <PopSlot slotId={8} />
      <PopSlot slotId={9} />
      <PopSlot slotId={10} />
      <PopSlot slotId={11} />
      <PopSlot slotId={12} />
      <PopSlot slotId={13} />
      <PopSlot slotId={14} />
      <PopSlot slotId={15} />
      <PopSlot slotId={16} />
      <PopSlot slotId={17} />
      <PopSlot slotId={18} />
      <PopSlot slotId={19} />
    </div>
  );
};

function PopSlot({ slotId }) {
  const [refresher, setRefresher] = useState(0);
  popSlotRefresher[slotId] = setRefresher;
  var key = popSlotKeys[slotId];
  if (!key) return <></>;
  var popObj = popupArray.find((item) => item.Key == key);
  if (popObj) {
    return <Popup popupObject={popObj} key={popObj.Key} Key={popObj.Key} Component={popObj.Component} PopupProps={popObj.PopupProps} ComponentProps={popObj.ComponentProps} />;
  }
  console.log(`unreachable code on PopSlot ${slotId} detected with key ${key}`);
  popSlotKeys[slotId] = "";
  return <></>;
}

function Popup({ Component, ComponentProps, PopupProps, Key, popupObject }) {
  const [refresher, setRefresher] = useState(0);
  const headerRef = useRef();
  const popRef = useRef();
  const modalRef = useRef();
  const bodyRef = useRef();
  const footerRef = useRef();
  const maxRef = useRef();
  const maxRef1 = useRef();
  const maxRef2 = useRef();
  const minRef1 = useRef();
  const minRef2 = useRef();

  const hdrMouseDnEvent = useCallback((e) => {
    publicHdrMouseDnEvent(e, popupObject, PopupProps, headerRef, popRef);
  }, []);

  const maxmizeClicked = useCallback(() => {
    publicMaxmizeClicked(popupObject, popRef, bodyRef, footerRef, maxRef, maxRef1, maxRef2);
  }, []);

  const switchToTop = useCallback((source) => {
    publicSwitchToTop(source, PopupProps, popRef);
  }, []);

  const minimizeClicked = useCallback(() => {
    publicMinimizeClicked(popupObject, popRef, bodyRef, footerRef, maxRef, minRef1, minRef2);
  }, []);

  const show = useCallback(() => {
    if (popRef.current) popRef.current.style.display = null;
  }, []);

  const hide = useCallback(() => {
    if (popRef.current) popRef.current.style.display = "none";
  }, []);

  if (!popupObject.switchToTop) {
    popupObject.switchToTop = switchToTop;
    popupObject.minimizeClicked = minimizeClicked;
    popupObject.show = show;
    popupObject.hide = hide;
    popupObject.popRef = popRef;
    popupObject.bodyRef = bodyRef;
    popupObject.modalRef = modalRef;
    PopupProps.setRefresher = setRefresher;
  }

  // Handle z-index for topMost and modal popups
  if (PopupProps.topMost) {
    if (PopupProps.modal && PopupProps.modalStyle.zIndex != PopupProps.modalZindex + topMostZIndexPlus) {
      PopupProps.modalStyle = { ...PopupProps.modalStyle, zIndex: PopupProps.modalZindex + topMostZIndexPlus };
    }
    if (PopupProps.popStyle.zIndex != PopupProps.popZindex + topMostZIndexPlus) {
      PopupProps.popStyle = { ...PopupProps.popStyle, zIndex: PopupProps.popZindex + topMostZIndexPlus };
    }
  } else {
    // Normal popup/drawer - use regular z-index
    if (PopupProps.modal && PopupProps.modalStyle.zIndex != PopupProps.modalZindex) {
      PopupProps.modalStyle = { ...PopupProps.modalStyle, zIndex: PopupProps.modalZindex };
    }
    if (PopupProps.popStyle.zIndex != PopupProps.popZindex) {
      PopupProps.popStyle = { ...PopupProps.popStyle, zIndex: PopupProps.popZindex };
    }
  }

  return (
    <>
      {PopupProps.modal && <div key="PopModal" ref={modalRef} className="PopEase60" style={PopupProps.modalStyle}></div>}
      <div key="Pop" ref={popRef} className={"Pop " + PopupProps.animation} style={PopupProps.popStyle}>
        <div key="PopHeader" ref={headerRef} className="PopHdr" style={PopupProps.hdrStyle} onMouseDown={hdrMouseDnEvent}>
          <table style={{ width: "100%" }}>
            <tbody>
              <tr>
                <td>
                  <HeaderText popupObject={popupObject} />
                </td>
                <td style={{ padding: 0, verticalAlign: "top" }}>
                  <table style={{ float: "right" }}>
                    <tbody>
                      <tr>
                        <td style={{ padding: 0 }}>
                          {PopupProps.minButton && (
                            <>
                              <span ref={minRef1} className="PopHrdBtn" onMouseDown={propagationStopper} onClick={minimizeClicked}>
                                -
                              </span>
                              <span ref={minRef2} className="PopHrdBtn" onMouseDown={propagationStopper} onClick={minimizeClicked} style={{ display: "none", fontSize: "12px", lineHeight: 1.9 }}>
                                <FaWindowRestore />
                              </span>
                            </>
                          )}
                        </td>
                        <td style={{ padding: 0 }}>
                          {PopupProps.maxButton && (
                            <div ref={maxRef}>
                              <span ref={maxRef1} className="PopHrdBtn" onMouseDown={propagationStopper} onClick={maxmizeClicked}>
                                &#9744;
                              </span>
                              <span ref={maxRef2} className="PopHrdBtn" onMouseDown={propagationStopper} onClick={maxmizeClicked} style={{ display: "none", fontSize: "12px", lineHeight: 1.9 }}>
                                <FaWindowRestore />
                              </span>
                            </div>
                          )}
                        </td>
                        <td style={{ padding: 0 }}>
                          {PopupProps.closeButton && (
                            <span
                              className="PopHrdBtn"
                              onMouseDown={propagationStopper}
                              onClick={() => {
                                publicClosePopup(Key, null, popupObject, cnstClosedBy.closer);
                              }}
                              style={{ fontSize: "12px", lineHeight: 1.9 }}>
                              <FaXmark />
                            </span>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div key="PopCnt" className="scrollbar PopCnt" ref={bodyRef} style={PopupProps.cntStyle}>
          <div className="w-100" style={{ height: "95%" }}>{Component === "html" || Component === "HTML" ? ComponentProps : <Component {...ComponentProps} />}</div>
        </div>
        {PopupProps.footer && <Footer key="PopFooter" ref={footerRef} popupObject={popupObject} />}
        <div key="PopLoader" className="PopLoader" style={loaderStyle}>
          <div className="PopLoader2" />
        </div>
        {PopupProps.resizable && (
          <>
            <div
              key="PopResizer0"
              className="PopResizer PopResizer0"
              onMouseDown={(e) => {
                PopResizerMsDn(e, 0, popRef);
              }}
            />
            <div
              key="PopResizer1"
              className="PopResizer PopResizer1"
              onMouseDown={(e) => {
                PopResizerMsDn(e, 1, popRef);
              }}
            />
            <div
              key="PopResizer2"
              className="PopResizer PopResizer2"
              onMouseDown={(e) => {
                PopResizerMsDn(e, 2, popRef);
              }}
            />
            <div
              key="PopResizer3"
              className="PopResizer PopResizer3"
              onMouseDown={(e) => {
                PopResizerMsDn(e, 3, popRef);
              }}
            />
            <div
              key="PopResizer4"
              className="PopResizer PopResizer4"
              onMouseDown={(e) => {
                PopResizerMsDn(e, 4, popRef);
              }}
            />
            <div
              key="PopResizer5"
              className="PopResizer PopResizer5"
              onMouseDown={(e) => {
                PopResizerMsDn(e, 5, popRef);
              }}
            />
            <div
              key="PopResizer6"
              className="PopResizer PopResizer6"
              onMouseDown={(e) => {
                PopResizerMsDn(e, 6, popRef);
              }}
            />
            <div
              key="PopResizer7"
              className="PopResizer PopResizer7"
              onMouseDown={(e) => {
                PopResizerMsDn(e, 7, popRef);
              }}
            />
          </>
        )}
      </div>
    </>
  );
}

function HeaderText({ popupObject }) {
  const [refresher, setHeaderRefresher] = useState(0);
  popupObject.setHeaderRefresher = setHeaderRefresher;
  return <b>{popupObject.PopupProps.header}</b>;
}

const Footer = forwardRef(function Footer({ popupObject }, ref) {
  const [refresher, setFooterRefresher] = useState(0);

  popupObject.setFooterRefresher = setFooterRefresher;

  if (popupObject?.PopupProps?.footerCentered) {
    var ftrStyle1 = { ...ftrStyle, textAlign: "center" };
  } else {
    var ftrStyle1 = ftrStyle;
  }

  return (
    <div ref={ref} className="PopFtr" style={ftrStyle1}>
      {popupObject.PopupProps.footer.map((item) => {
        if (item.name === undefined) item.name = "";
        if (item.variant === undefined) item.variant = "secondary";
        if (item.class === undefined) item.class = "";
        item.style = { ...item.style };
        if (item.isLeft) item.style.float = 'left';
        if (item.marginLeft) item.style.marginLeft = item.marginLeft;
        if (item.padding) {
          item.style.paddingLeft = item.padding;
          item.style.paddingRight = item.padding;
        }
        if (item.marginRight) item.style.marginRight = item.marginRight;
        if (item.width) item.style.width = item.width;

        if (popupObject.cacheVisibleStatus[item.name] === false) {
          item.style.visibility = 'hidden'
        } else if (popupObject.cacheVisibleStatus[item.name] === true) {
          item.style.visibility = 'visible'
        }

        if (item.type == "ddl") {
          var vl = popupObject.cacheDdlValue[item.name] ?? "";
          popupObject.cacheDdlValue[item.name] = vl;

          var blankRow = false
          if (item.items && item.items[0] && item.items[0].value != "") {
            blankRow = true
          }

          return <div key={Math.random().toString(36).replace("0.", "ddl")} className={`PopFtrDdl ${item.class}`} style={item.style}>
            <span>{item.text}</span>
            <select {...item?.props} className="select select-sm select-bordered" defaultValue={vl}
              onChange={e => { publicFooterBtnOnClickPre(e, "ddl", item.name, popupObject) }}
            >
              {blankRow && <option key="fgd8g99d8f8sd8" value="" hidden={true} ></option>}
              {item.items?.map(x => <option key={x.value} value={x.value}>{x.text}</option>)}
            </select>
          </div>
        }

        if (item.type == 'checkbox') {
          item.style.marginTop = 8;
          if (!item.style?.marginLeft) item.style.marginLeft=10;
          var checked = popupObject.cacheChecked[item.name] ? true : false;
          popupObject.cacheChecked[item.name] = checked;
          var id = Math.random().toString(36).replace("0.", "chk")
          return (
            <div key={Math.random().toString(36).replace("0.", "chk")} style={item?.style}>
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">{item?.text}</span>
                  <input type="checkbox" id={id} className="checkbox checkbox-primary" defaultChecked={checked}
                    onChange={e => { publicFooterBtnOnClickPre(e, "check", item.name, popupObject) }}
                  />
                </label>
              </div>
            </div>
          );
        }

        return (
          <button
            {...item?.props}
            key={item.name}
            style={{ height: ftrBtnHeight, ...item.style }}
            className={`btn ${item.variant ? `btn-${item.variant}` : 'btn-secondary'} PopFtrBtn ${item.class}`}
            onClick={(e) => {
              publicFooterBtnOnClickPre(e, "btn", item.name, popupObject);
            }}>
            {item.html}
            {item.text}
          </button>
        );
      })}
    </div >
  );
});

let activeKey = null;
let activePopupObject = null;
let activeStep= null;

function publicSwitchToTop(source, PopupProps, popRef) {
  if (MyVars.PopupTopOne == PopupProps.key) return;
  if (MyVars.PopupTopOneOwner == PopupProps.key) return;
  if (source == "hdrMouseDnEvent" && PopupProps.modal) return;
 
  activeKey = PopupProps.key;
  activePopupObject = popupArray.find(item => item.Key === activeKey);

  // Set z-indexes: modal backdrop first, then popup above it
  if (PopupProps.modal) {
    PopupProps.modalZindex = MyVars.PopupMaxZIndex++;
    PopupProps.modalStyle = { ...PopupProps.modalStyle, zIndex: PopupProps.modalZindex };
  }

  PopupProps.popZindex = MyVars.PopupMaxZIndex++;
  PopupProps.popStyle = { ...PopupProps.popStyle, zIndex: PopupProps.popZindex };

  MyVars.PopupTopOne = PopupProps.key;
  MyVars.PopupTopOneOwner = PopupProps.owner;

  if (source == "switchMyChild" || source == "hdrMouseDnEvent") {
    if (popRef && popRef.current) {
      if (PopupProps.topMost) {
        popRef.current.style.zIndex = PopupProps.popZindex + topMostZIndexPlus;
      } else {
        popRef.current.style.zIndex = PopupProps.popZindex;
      }
    }
  }

  if (source == "hdrMouseDnEvent") {
    // for for all children owned by me-> switch them to top also
    popupArray.forEach((item) => {
      if (item.PopupProps.owner === PopupProps.key) {
        item.switchToTop("switchMyChild");
      }
    });
  }
}

const publicHideMyChildren = (myKey) => {
  popupArray.forEach((item) => {
    if (item.PopupProps.owner === myKey) {
      if (!popMinSlots.includes(item.Key)) item.hide();
    }
  });
};

const publicShowMyChildren = (myKey) => {
  popupArray.forEach((item) => {
    if (item.PopupProps.owner === myKey) {
      item.show();
    }
  });
};

const publicMinimizeClicked = (popupObject, popRef, bodyRef, footerRef, maxRef, minRef1, minRef2) => {
  popupObject.switchToTop("hdrMouseDnEvent");
  var slotIx = popMinSlots.indexOf(popupObject.Key);
  if (slotIx == -1) {
    var freeSlotIx = popMinSlots.indexOf("");
    if (freeSlotIx == -1) return; // all slots are full
    // code to minimize
    popMinSlots[freeSlotIx] = popupObject.Key;
    ShowHideResizers(popRef, "none");

    if (bodyRef.current) bodyRef.current.style.display = "none";
    if (footerRef.current) footerRef.current.style.display = "none";
    if (popRef.current) {
      popRef.current.LastHeight = popRef.current.style.height;
      popRef.current.style.height = hdrHeight + "px";
      popRef.current.LastTop = popRef.current.style.top;
      popRef.current.LastLeft = popRef.current.style.left;
      popRef.current.LastWidth = popRef.current.style.width;
      popRef.current.style.top = null;
      popRef.current.style.bottom = "1px";
      popRef.current.style.left = freeSlotIx * popMinSlotWidth + 1 + "px";
      popRef.current.style.width = popMinSlotWidth + "px";
    }
    if (maxRef.current) maxRef.current.style.display = "none";
    if (minRef1.current) {
      minRef1.current.style.display = "none";
      minRef2.current.style.display = null;
    }
    publicHideMyChildren(popupObject.Key);
  } else {
    // code to restore
    popMinSlots[slotIx] = "";

    if (bodyRef.current) bodyRef.current.style.display = "block";
    if (footerRef.current) footerRef.current.style.display = "block";
    if (popRef.current) {
      popRef.current.style.height = popRef.current.LastHeight;
      popRef.current.style.top = popRef.current.LastTop;
      popRef.current.style.left = popRef.current.LastLeft;
      popRef.current.style.width = popRef.current.LastWidth;
      popRef.current.style.bottom = null;
      
      if (!popRef.current.IsMaximized) {
        ShowHideResizers(popRef, "block");
      }
    }

    if (maxRef.current) {
      maxRef.current.style.display = null;
    }
    if (minRef1.current) {
      minRef2.current.style.display = "none";
      minRef1.current.style.display = null;
    }
    publicShowMyChildren(popupObject.Key);
  }
};

const publicMaxmizeClicked = (popupObject, popRef, bodyRef, footerRef, maxRef, maxRef1, maxRef2) => {
  popupObject.switchToTop("hdrMouseDnEvent");

  if (popRef.current && popRef.current.IsMaximized) {
    popRef.current.style.top = popRef.current.XLastTop;
    popRef.current.style.left = popRef.current.XLastLeft;
    popRef.current.style.width = popRef.current.XLastWidth;
    popRef.current.style.height = popRef.current.XLastHeight;
    popRef.current.IsMaximized = false;

    ShowHideResizers(popRef, "block");

    if (maxRef.current) {
      maxRef2.current.style.display = "none";
      maxRef1.current.style.display = null;
    }
  } else if (popRef.current) {
    popRef.current.XLastTop = popRef.current.style.top;
    popRef.current.XLastLeft = popRef.current.style.left;
    popRef.current.XLastWidth = popRef.current.style.width;
    popRef.current.XLastHeight = popRef.current.style.height;

    popRef.current.style.top = "5px";
    popRef.current.style.left = "5px";
    popRef.current.style.width = window.innerWidth - 12 + "px";
    popRef.current.style.height = window.innerHeight - 10 + "px";
    popRef.current.IsMaximized = true;

    ShowHideResizers(popRef, "none");

    if (maxRef.current) {
      maxRef1.current.style.display = "none";
      maxRef2.current.style.display = null;
    }
  }
};

function ShowHideResizers(popRef, display) {
  if (popRef && popRef.current) {
    popRef.current.querySelectorAll(":scope > div.PopResizer").forEach(function (item) {
      item.style.display = display;
    });
  }
}

function PopResizerMsDn(e, dir, popRef) {
  e.stopPropagation();
  MyVars.IsResizing = true;
  MyVars.OffsetX = e.clientX;
  MyVars.OffsetY = e.clientY;

  function rHandleMouseUp(e) {
    MyVars.IsResizing = false;
    window.removeEventListener("mouseup", rHandleMouseUp);
    window.removeEventListener("mousemove", rHandleMouseMove);
  }
  function rHandleMouseMove(e) {
    if (popRef.current) {
      if (dir == 4 || dir == 3 || dir == 5) { // 4 bottom
        var ht = parseInt(popRef.current.style.height) + e.clientY - MyVars.OffsetY;
        if (ht < 150) return;
        popRef.current.style.height = ht + "px";
      }
      if (dir == 0 || dir == 1 || dir == 7) { // 0 top
        var top = parseInt(popRef.current.style.top) + e.clientY - MyVars.OffsetY;
        if (top < 0) return;
        var ht = parseInt(popRef.current.style.height) - e.clientY + MyVars.OffsetY;
        if (ht < 150) return;
        popRef.current.style.top = top + "px";
        popRef.current.style.height = ht + "px";
      }
      if (dir == 2 || dir == 1 || dir == 3) { // 2 right
        var wd = parseInt(popRef.current.style.width) + e.clientX - MyVars.OffsetX;
        if (wd < 300) return;
        popRef.current.style.width = wd + "px";
      }
      if (dir == 6 || dir == 5 || dir == 7) { // 6 left
        var wd = parseInt(popRef.current.style.width) - e.clientX + MyVars.OffsetX;
        if (wd < 300) return;
        popRef.current.style.left = parseInt(popRef.current.style.left) + e.clientX - MyVars.OffsetX + "px";
        popRef.current.style.width = wd + "px";
      }
    }

    MyVars.OffsetX = e.clientX;
    MyVars.OffsetY = e.clientY;
  }
  window.addEventListener("mouseup", rHandleMouseUp);
  window.addEventListener("mousemove", rHandleMouseMove);
}

const publicHdrMouseDnEvent = (e, popupObject, PopupProps, headerRef, popRef) => {
  // Allow minimize/restore functionality even when popup is minimized
  if (!popMinSlots.includes(popupObject.Key)) {
    popupObject.switchToTop("hdrMouseDnEvent");
  }
  if (!PopupProps.movable) return;
  // Only prevent dragging when minimized, but allow other interactions
  if (popMinSlots.includes(popupObject.Key)) return;
  if (headerRef.current) headerRef.current.style.cursor = "grabbing";
  MyVars.PopupIsMoving = true;
  if (popRef.current) {
    MyVars.PopupOffsetX = e.clientX - popRef.current.offsetLeft;
    MyVars.PopupOffsetY = e.clientY - popRef.current.offsetTop;
  }

  function handleMouseUp(e) {
    console.log("Mouse button released!", e);
    if (headerRef.current) headerRef.current.style.cursor = "grab";
    MyVars.PopupIsMoving = false;
    window.removeEventListener("mouseup", handleMouseUp);
    window.removeEventListener("mousemove", handleMouseMove);
    if (popRef.current && parseInt(popRef.current.style.top) < 0) popRef.current.style.top = 0;
  }
  function handleMouseMove(e) {
    if (popRef.current) {
      popRef.current.style.left = e.clientX - MyVars.PopupOffsetX + "px";
      popRef.current.style.top = e.clientY - MyVars.PopupOffsetY + "px";
    }
  }
  window.addEventListener("mouseup", handleMouseUp);
  window.addEventListener("mousemove", handleMouseMove);
};

const publicFooterBtnOnClickPre = (e, type, nm, popupObject) => {
  if (popupObject.isHeld) return;
  if (type == "btn") {
    e.target.disabled = true;
    setTimeout(() => {
      try {
        e.target.disabled = false;
      } catch { }
    }, 600);
    publicFooterBtnOnClick(nm, popupObject);
  }
  if (type == "check") {
    popupObject.cacheChecked[nm] = e.target.checked;
    setTimeout(() => {
      publicFooterBtnOnClick(nm, popupObject, e.target.checked);
    }, 50);
  }
  if (type == "ddl") {
    popupObject.cacheDdlValue[nm] = e.target.value;
    setTimeout(() => {
      publicFooterBtnOnClick(nm, popupObject, e.target.value);
    }, 50);
  }
};

const publicFooterBtnOnClick = (nm, popupObject, value) => {
  if (popupObject.Component === "html" || popupObject.Component === "HTML" || !nm) {
    publicClosePopup(popupObject.Key, nm, popupObject, cnstClosedBy.footerButton);
    return;
  }
  var fnOnClick = popupObject.ComponentProps?.popup?.footerButtonOnClick;
  if (fnOnClick) {
    fnOnClick(nm, value);
  } else {
    console.log("popup.footerButtonOnClick function is not exist");
  }
};

const propagationStopper = (e) => {
  e.stopPropagation();
};

export async function openConfirm(head, body, extra = {}) {
  var { confirmButtonText = "OK", cancelButtonText = "Cancel" } = extra;

  var html = (
    <>
      <br />
      <BsExclamationCircle style={{ fontSize: 90, color: "#f8bb86", marginLeft: 210 }} />
      <br />
      <br />
      <p style={{ textAlign: "center", fontSize: 28, fontWeight: "600" }}>{head}</p>
      <p style={{ textAlign: "center", fontSize: 18 }}>{body}</p>
    </>
  );

  var props = {
    animation: "PopScaleUp",
    size: [550, 380],
    closeButton: false,
    showHeader: false,
    footerCentered: true,
    resizable: false,
    footer: [
      { name: "ok", text: confirmButtonText, variant: "primary" },
      { name: "cancel", text: cancelButtonText, variant: "secondary" },
    ],
  };

  return new Promise((resolve) => {
    openPopup("html", html, props, function (resp) {
      if (resp == "ok") resolve(true);
      resolve(false);
    });
  });
}