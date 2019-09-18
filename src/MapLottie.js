// @flow
import React from 'react'
import Lottie from 'react-lottie'
import animationData from './yml-lottie.json'
import {
    Button,
    Dialog,
    DialogContent,
    DialogContentText,
    Typography
 } from '@material-ui/core'

//////////// TYPES //////////////////////

type DefaultOptions = {
    loop: boolean,
    autoPlay: boolean,
    animationData: any,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
}

//////////// CONSTANTS ///////////////////

const defaultOptions: DefaultOptions = {
    animationData: animationData,
    autoplay: true, 
    loop: true,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
}

const HELPER_TEXT: string = 'Tap on map to outline your lawn to calculate square footage.'

//////////// COMPONENT ///////////////////

type Props = {|
    handleClose: () => void,
    open: boolean
|}

/**
 * Map Instructional Dialog
 * @summary Dialog w/ Instructional Lottie for Yard Maping Portion of Subscription/Signup 
 * @param {Props} props - Component properties
 * @return {JSX} - Dialog to render
 */
const MapLottie = ({
    closeLottie,
    open
}: Props) => (
    <Dialog
        style={{ padding: 0, borderRadius: 0 }}
        open={open}
        onClose={closeLottie}>
        <DialogContent
            style={{
                padding: 0,
                maxWidth: '477px'
                }}>
        <Lottie
            options={defaultOptions}/>
        <DialogContentText>
            {/* PLACEHOLDER FOR TYPOGRAPHY */}
            <Typography
                style={{
                    padding: '16px 24px',
                    color: '#767679',
                    fontSize: '16px'
                }}
                variant={'body2'}>
            {HELPER_TEXT}
            </Typography>
            </DialogContentText>
        <Button
            style={{
                margin: 0,
                borderRadius: 0,
                backgroundColor: '#0d9ed9'
            }}
            variant={'contained'}
            fullWidth
            onClick={closeLottie}
            color="primary"
            autoFocus>
            {'GOT IT'}
            </Button>
        </DialogContent>
    </Dialog>
)

export default MapLottie