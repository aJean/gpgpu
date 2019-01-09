import bindPage from './camera';
import bindVideo from './video';

export default {
    startCamera() {
        bindPage();
    },

    startVideo() {
        bindVideo();
    }
}