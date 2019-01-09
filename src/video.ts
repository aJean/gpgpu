import * as posenet from '@tensorflow-models/posenet';
import { drawKeypoints, drawSkeleton, drawBoundingBox } from './util';

const width = 340;
const height = 600;
let vWidth = width;
let vHeight = height;
let tid;

export default async function bindVideo() {
    const video = document.createElement('video');
    video.src = './pose.mp4';
    video.loop = false;
    video.controls = true;
    video.preload = 'auto';
    video.width = width;
    video.height = height;
    video.style.cssText = 'margin-left:50px;';

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = vWidth;
    canvas.height = vHeight;
    canvas.style.cssText = 'position:absolute;left:650px;top:10px;border:1px solid red;object-fit:fill;';
    
    document.getElementById('video-wrap').appendChild(video);
    document.getElementById('video-wrap').appendChild(canvas);

    function animation() {
        detectPos(video, ctx);
        tid = requestAnimationFrame(animation);
    }

    video.addEventListener('timeupdate', () => {
        detectPos(video, ctx);
    });

    video.addEventListener('pause', () => {
        cancelAnimationFrame(tid);
    });

    guiState.net = await posenet.load(0.75);
}

const guiState = {
    algorithm: 'multi-pose',
    input: {
        mobileNetArchitecture: '0.75',
        outputStride: 16,
        imageScaleFactor: 0.5,
    },
    singlePoseDetection: {
        minPoseConfidence: 0.1,
        minPartConfidence: 0.5,
    },
    multiPoseDetection: {
        maxPoseDetections: 5,
        minPoseConfidence: 0.15,
        minPartConfidence: 0.1,
        nmsRadius: 30.0,
    },
    output: {
        showVideo: true,
        showSkeleton: true,
        showPoints: true,
        showBoundingBox: false,
    },
    net: null,
};

async function detectPos(video, ctx) {
    const imageScaleFactor = 0.5;
    const outputStride = 16;
    const flipHorizontal = false;
    const minPoseConfidence = 0.15;
    const minPartConfidence = 0.1;

    let poses = [];

    const pose = await guiState.net.estimateSinglePose(video, imageScaleFactor, flipHorizontal, outputStride);
    poses.push(pose);
    // pose.keypoints.forEach(data => console.log('part: ' + data.part + '|x: ' + data.position.x + '|y: ' + data.position.y));
    // console.log('=============================================================================');

    ctx.clearRect(0, 0, vWidth, vHeight);
    ctx.drawImage(video, 0, 0, vWidth, vHeight);

    poses.forEach(({ score, keypoints }) => {
        if (score >= minPoseConfidence) {
            if (guiState.output.showPoints) {
                drawKeypoints(keypoints, minPartConfidence, ctx);
            }
            if (guiState.output.showSkeleton) {
                drawSkeleton(keypoints, minPartConfidence, ctx);
            }
            if (guiState.output.showBoundingBox) {
                drawBoundingBox(keypoints, ctx);
            }
        }
    });
}   