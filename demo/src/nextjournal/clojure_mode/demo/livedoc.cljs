(ns nextjournal.clojure-mode.demo.livedoc
  (:require
   ["react" :as react]
   [applied-science.js-interop :as j]
   [clojure.string :as str]
   [nextjournal.clerk.sci-viewer :as sv]
   [nextjournal.clerk.viewer :as v]
   [nextjournal.clojure-mode.demo :as demo]
   [nextjournal.clojure-mode.demo.sci :as demo.sci]
   [nextjournal.livedoc :as livedoc]
   [nextjournal.ui.components.d3-require :as d3-require]
   [reagent.dom :as rdom]
   [shadow.resource :as rc]
   [reagent.core :as r]
   [sci.core :as sci]))

(defn result-view [r]
  (when-some [{:keys [error result]} r]
    [:div.viewer-result.m-2 {:style {:font-family "var(--code-font)"}}
     (cond
       error [:div.red error]
       (react/isValidElement result) result
       result [sv/inspect-paginated result])]))

(defn wrap-element [el]
  (v/with-viewer :html
    (r/with-let [refn (fn [parent] (when parent (.append parent el)))]
      [:div {:ref refn}])))

;; ctx libs
(defn inspect [data]
  (when-some [wrapped-value
              (when data
                (cond
                  (v/wrapped-value? data) data
                  (or (instance? js/SVGElement data)
                      (instance? js/HTMLElement data))
                  (wrap-element data)
                  'else data))]
    [sv/inspect-paginated wrapped-value]))

(defn with-fetch* [url handler]
  (r/with-let [data (r/atom nil)]
    ;; FIXME: promise chain trick to have handler called on response
    (.. (js/fetch url) (then #(.text %)) (then #(reset! data (handler %))))
    (fn []
      [inspect @data])))

(defn with-fetch [url handler]
  (r/as-element [with-fetch* url handler]))

(defn ^:dev/after-load render []
  ;; set viewer tailwind stylesheet
  (j/assoc! (js/document.getElementById "viewer-stylesheet")
            :innerHTML (rc/inline "stylesheets/viewer.css"))

  (rdom/render
   [d3-require/with {:package ["@observablehq/plot@0.5" "papaparse@5.3.2"]}
    (fn [^js lib]
      ;; d3-require merges modules into a single object

      (r/with-let [ctx (sci/merge-opts
                        (sci/fork @sv/!sci-ctx)
                        {:namespaces
                         {'livedoc {'with-fetch with-fetch}
                          'observable {'Plot lib}
                          'csv {'parse (fn [data] (.. lib (parse data (j/obj :header true :dynamicTyping true)) -data))}}})]

        [:div.rounded-md.mb-0.text-sm.border.shadow-lg.bg-white
         [livedoc/editor {:focus? true
                          :extensions [demo/theme]
                          :tooltip (fn [text _editor-view]
                                     (let [tt-el (js/document.createElement "div")]
                                       (rdom/render [:div.p-3 [result-view (demo.sci/eval-string ctx text)]] tt-el)
                                       (j/obj :dom tt-el)))

                          ;; each cell is assigned a `state` reagent atom
                          :eval-fn!
                          (fn [state]
                            (swap! state (fn [{:as s :keys [text]}]
                                           (assoc s :result (demo.sci/eval-string ctx text)))))

                          :render
                          (fn [state]
                            (fn []
                              (let [{:keys [text type selected?] r :result} @state]
                                [:div.flex.flex-col.rounded.m-2
                                 {:class (when selected? "ring-4")}
                                 (case type
                                   :markdown
                                   [:div.p-3.rounded.border
                                    [:div.max-w-prose
                                     [sv/inspect-paginated (v/with-viewer :markdown (:text @state))]]]

                                   :code
                                   [:<>
                                    [:div.p-2.rounded.border.bg-slate-100
                                     [sv/inspect-paginated (v/with-viewer :code text)]]
                                    [result-view r]])])))
                          :doc (rc/inline "livedoc.md")}]]))] (js/document.getElementById "livedoc-container"))



  ;; longer example
  #_
  (-> (js/fetch "https://raw.githubusercontent.com/applied-science/js-interop/master/README.md")
      (.then #(.text %))
      (.then #(-> %  ;; literal fixes
                  (str/replace "…some javascript object…" ":x 123")
                  (str/replace "…" "'…")
                  (str/replace "..." "'…")
                  #_ (str/replace "default-value" "'default-value")
                  (str/replace "default" "'default")
                  (str/replace "! a 10)" "! (into-array [1 2 3]) 10)")))
      (.then (fn [markdown-doc]
               ;; hack into Clerk's sci-viewer context
               (let [ctx' (sci.core/merge-opts
                           (sci.core/fork @sv/!sci-ctx)
                           ;; FIXME: a more sane approach to js-interop ctx fixes
                           {:namespaces {'user {'obj (j/lit {:x {:y 1} :z 2 :a 1})
                                                '.-someFunction :someFunction
                                                'o (j/obj :someFunction (fn [x] (str "called with: " x)))
                                                '.-x :x '.-y :y '.-z :z '.-a :a
                                                'some-seq [#js {:x 1 :y 2} #js {:x 3 :y 4}]}
                                         'my.app {'.-x :x '.-y :y '.-a :a '.-b :b '.-c :c
                                                  'some-seq [#js {:x 1 :y 2} #js {:x 3 :y 4}]}
                                         'cljs.core {'implements? (fn [c i] false)
                                                     'ISeq nil}}})]
                 (rdom/render
                  [:div
                   [:div.text-lg.font-medium.mb-4
                    [:em "Testing LiveDoc on somewhat larger texts like " [:a {:href "https://github.com/applied-science/js-interop"} "js-interop"] " README."]]
                   [:div.rounded-md.mb-0.text-sm.monospace.border.shadow-lg.bg-white
                    [livedoc/editor {:doc markdown-doc
                                     :extensions [demo/theme]
                                     :tooltip (fn [text _editor-view]
                                                (let [tt-el (js/document.createElement "div")]
                                                  (rdom/render [:div.p-3 [eval-code-view text]] tt-el)
                                                  (j/obj :dom tt-el)))

                                     :eval-fn!
                                     (fn [state]
                                       (when state
                                         (swap! state (fn [{:as s :keys [text]}]
                                                        (assoc s :result (demo.sci/eval-string ctx' text))))))

                                     :render
                                     (fn [state]
                                       (fn []
                                         (let [{:keys [text type selected?] r :result} @state]
                                           [:div.flex.flex-col.rounded.m-2
                                            {:class (when selected? "ring-4")}
                                            (case type
                                              :markdown
                                              [:div.p-3.rounded.border
                                               [:div.max-w-prose
                                                [sv/inspect-paginated (v/with-viewer :markdown (:text @state))]]]

                                              :code
                                              [:<>
                                               [:div.p-2.rounded.border.bg-slate-200
                                                [sv/inspect-paginated (v/with-viewer :code text)]]
                                               (when-some [{:keys [error result]} r]
                                                 [:div.viewer-result.m-2
                                                  {:style {:font-family "var(--code-font)"}}
                                                  (cond
                                                    error [:div.red error]
                                                    (react/isValidElement result) result
                                                    result (sv/inspect-paginated result))])])])))}]]]
                  (js/document.getElementById "livedoc-large-container")))))))
