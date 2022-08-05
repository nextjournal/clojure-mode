(ns nextjournal.clojure-mode.demo.livedoc
  (:require [nextjournal.clojure-mode.demo :as demo]
            [nextjournal.clerk.sci-viewer :as sv]
            [nextjournal.clerk.viewer :as v]
            [applied-science.js-interop :as j]
            [shadow.resource :as rc]
            [clojure.string :as str]
            [nextjournal.livedoc :as livedoc]
            [nextjournal.clojure-mode.demo.sci :as demo.sci]
            ["react" :as react]
            [reagent.dom :as rdom]))

(defn eval-code-view
  ([code] (eval-code-view @sv/!sci-ctx code))
  ([ctx code]
   [:div.viewer-result {:style {:white-space "pre-wrap" :font-family "var(--code-font)"}}
    (when-some [{:keys [error result]} (when (seq (str/trim code)) (demo.sci/eval-string ctx code))]
      (cond
        error [:div.red error]
        (react/isValidElement result) result
        'result (sv/inspect-paginated result)))]))

(defn ^:dev/after-load render []
  ;; set viewer tailwind stylesheet
  (j/assoc! (js/document.getElementById "viewer-stylesheet")
            :innerHTML (rc/inline "stylesheets/viewer.css"))

  (rdom/render [:div
                [:div.rounded-md.mb-0.text-sm.monospace.border.shadow-lg.bg-white
                 [livedoc/editor {:focus? true
                                  :extensions [demo/theme]
                                  :tooltip (fn [text _editor-view]
                                             (let [tt-el (js/document.createElement "div")]
                                               (rdom/render [:div.p-3 [eval-code-view text]] tt-el)
                                               (j/obj :dom tt-el)))

                                  ;; each cell is assigned a `state` reagent atom
                                  :eval-fn!
                                  (fn [state]
                                    (swap! state (fn [{:as s :keys [text]}]
                                                   (assoc s :result (demo.sci/eval-string text)))))


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
                                            (when-some [{:keys [error result]} r]
                                              [:div.viewer-result.m-2
                                               {:style {:font-family "var(--code-font)"}}
                                               (cond
                                                 error [:div.red error]
                                                 (react/isValidElement result) result
                                                 result (sv/inspect-paginated result))])])])))
                                  :doc (rc/inline "livedoc.md")}]]] (js/document.getElementById "livedoc-container"))



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
