import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { withRouter } from 'next/router';
import fetch from 'isomorphic-unfetch';

import config from 'config';
import {
    TitleGenerator,
    HeadGenerator,
    Layout,
} from 'components';

import 'style/pages/share-paper-submit.scss';

const Editor = function() {
    // https://xdsoft.net/jodit/
    const JoditEditor = dynamic(() => import('jodit-react'), {
        ssr: false
    });

    if (typeof window === 'undefined') {
        return null;
    } else {
        const paperContent = 'title';
        const changeHandler = val => {
            console.info('change', val); // eslint-disable-line
        };
        const editorConfig = {
            readonly: false,
            controls: {
                font: {
                    list: {
                        'brush script mt': 'Brush Script MT',
                        'consola': 'Consolas',
                        'microsoft yahei': 'MicroSoft Yahei',
                        'snell roundhand script': 'Snell Roundhand Script',
                    },
                },
            },
            buttons: [
                'font', 'fontsize', 'brush', 'paragraph', 'align',
                '|',
                'bold', 'strikethrough', 'underline', 'italic',
                '|',
                'superscript', 'subscript',
                '|',
                'ul', 'ol',
                '|',
                'outdent', 'indent',
                '|',
                'undo', 'redo',
                '\n',
                'hr',
                'eraser',
                'copyformat',
                '|',
                'symbol',
                'fullsize',
                '|',
                'image', 'file', 'video', 'table', 'link',
                '|',
            ],
            extraButtons: [
                {
                    name: 'upload',
                    icon: 'upload',
                    exec: function (editor) { // eslint-disable-line
                        console.info('upload'); // eslint-disable-line
                    }
                },
                {
                    name: 'save',
                    icon: 'save',
                    exec: function (editor) { // eslint-disable-line
                        console.info('save'); // eslint-disable-line
                    }
                },
            ],
        };
        const $editorRef = typeof window === 'undefined' ? null : window.jodit;

        return (
            <JoditEditor
                editorRef={ $editorRef }
                value={ paperContent }
                config={ editorConfig }
                onChange={ changeHandler }
            />
        );
    }
};
const paperSubmit = withRouter(function(props) {
    const seo = props.seo || {};
    const assetPrefix = config.dev ? '' : config.ossPublic.assetPrefix;

    useEffect(() => {
        const intervalTask = setInterval(() => {
            if (typeof window !== 'undefined' && window.jodit) {
                clearInterval(intervalTask);
            }
        }, 100);

        setTimeout(() => {
            clearInterval(intervalTask);
        }, 10000);
    }, []);

    return (
        <>
            <TitleGenerator title={ seo.title }/>
            <HeadGenerator seo={ seo }>
                <meta name="robots" content="nofollow"/>
                <link rel="stylesheet" href={ `${assetPrefix}/static/plugins/jodit/index.css` }/>
                <script src={ `${assetPrefix}/static/plugins/jodit/index.js` }></script>
            </HeadGenerator>
            <Layout>
                <div className="page-paper-submit">
                    <h1>Share Paper Submit Page 【TODO】</h1>
                    <div>Share Paper Submit page test</div>
                    <div style={{ margin: '25px 50px', }}>
                        <Editor/>
                    </div>
                </div>
            </Layout>
        </>
    );
});

paperSubmit.getInitialProps = async () => {
    const seoRes = await fetch(`${config.domain}/api/util/seo?pageName=paperSubmit`);
    const seoResult = await seoRes.json();
    
    const initProps = {
        seo: seoResult.data,
    };

    return initProps;
};

export default paperSubmit;