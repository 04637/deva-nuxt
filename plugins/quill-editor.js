import Quill from 'quill'
import VueQuillEditor from 'vue-quill-editor'
import { ImageDrop } from 'quill-image-drop-module'
import Vue from 'vue'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Quill.register('modules/imageDrop', ImageDrop)

Vue.use(VueQuillEditor)
