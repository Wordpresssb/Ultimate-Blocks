import icons from './icons';

//Importing Classname
import classnames from 'classnames';

//  Import CSS.
import './style.scss';
import './editor.scss';
import Inspector from "../social-share/inspector";

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks;

const {
    RichText,
    BlockControls,
    MediaUpload,
    InspectorControls,
    ColorPalette
} = wp.editor;

const {
    Button,
    PanelBody,
    PanelColor,
    RangeControl,
} = wp.components;

const {
	withState,
} = wp.compose;

/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'ub/testimonial-block', {

    title: __( 'Testimonial' ),
    icon: icons.testimonial,
    category: 'formatting',
    keywords: [
        __( 'testimonial' ),
        __( 'quotes' ),
        __( 'Ultimate Blocks' ),
    ],
    attributes: {
        ub_testimonial_text: {
            type: 'array',
            source: 'children',
            selector: '.ub_testimonial_text'
        },
        ub_testimonial_author: {
            type: 'array',
            source: 'children',
            selector: '.ub_testimonial_author'
        },
        ub_testimonial_author_role: {
            type: 'array',
            source: 'children',
            selector: '.ub_testimonial_author_role'
        },
        imgURL: {
            type: 'string',
            source: 'attribute',
            attribute: 'src',
            selector: 'img',
        },
        imgID: {
            type: 'number',
        },
        imgAlt: {
            type: 'string',
            source: 'attribute',
            attribute: 'alt',
            selector: 'img',
        },
        backgroundColor: {
            type: 'string',
            default: '#f4f6f6'
        },
        textColor: {
            type: 'string',
            default: '#444444'
        },
        textSize: {
            type: 'number',
            default: 17
        }
    },

    /**
     * The edit function describes the structure of your block in the context of the editor.
     * This represents what the editor will render when the block is used.
     *
     * The "edit" property must be a valid function.
     *
     * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
     */
    edit: withState( { editable: 'content' } ) ( function( props )
        {
            const {
                isSelected,
                editable,
                setState
            } = props;

            const onSetActiveEditable = ( newEditable ) => () => {
                setState( { editable: newEditable } )
            };

            const onChangeTestimonialText = value => {
                props.setAttributes( { ub_testimonial_text: value } );
            };

            const onChangeTestimonialAuthor = value => {
                props.setAttributes( { ub_testimonial_author: value } );
            };

            const onChangeTestimonialAuthorRole = value => {
                props.setAttributes( { ub_testimonial_author_role: value } );
            };

            const onSelectImage = img => {
                props.setAttributes( {
                    imgID: img.id,
                    imgURL: img.url,
                    imgAlt: img.alt,
                } );
            };
            const onRemoveImage = () => {
                props.setAttributes({
                    imgID: null,
                    imgURL: null,
                    imgAlt: null,
                });
            };

            return [

                isSelected && (
                    <BlockControls key="controls"/>
                ),

                isSelected && (
                    <InspectorControls>
                        <PanelColor
                            title={ __( 'Background Color' ) }
                            colorValue={ props.attributes.backgroundColor }
                            initialOpen={ true }
                        >
                            <ColorPalette
                                value={ props.attributes.backgroundColor }
                                onChange={ ( colorValue ) => props.setAttributes( { backgroundColor: colorValue } ) }
                                allowReset
                            />
                        </PanelColor>
                        <PanelBody
                            title={ __( 'Testimonial Body' ) }
                        >
                            <p>Font Color</p>
                            <ColorPalette
                                value={ props.attributes.textColor }
                                onChange={ ( colorValue ) => props.setAttributes( { textColor: colorValue } ) }
                                allowReset
                            />
                            <RangeControl
                                label={ __( 'Font Size' ) }
                                value={ props.attributes.textSize }
                                onChange={ ( value ) => props.setAttributes( { textSize: value } ) }
                                min={ 14 }
                                max={ 200 }
                                beforeIcon="editor-textcolor"
                                allowReset
                            />
                        </PanelBody>
                    </InspectorControls>
                ),

                <div className={ props.className }>
                    <div
                        className="ub_testimonial"
                        style={{
                            backgroundColor: props.attributes.backgroundColor,
                            color: props.attributes.textColor
                        }}
                    >
                        <div className="ub_testimonial_img">
                            { ! props.attributes.imgID ? (

                                <div className="ub_testimonial_upload_button">
                                    <MediaUpload
                                        onSelect={ onSelectImage }
                                        type="image"
                                        value={ props.attributes.imgID }
                                        render={ ( { open } ) => (
                                            <Button
                                                className="components-button button button-medium"
                                                onClick={ open }>
                                                Upload Image
                                            </Button>
                                        ) }
                                    />
                                    <p>Ideal Image size is Square i.e 150x150.</p>
                                </div>

                            ) : (

                                <p>
                                    <img
                                        src={ props.attributes.imgURL }
                                        alt={ props.attributes.imgAlt }
                                        height={ 100 }
                                        width={ 100 }
                                    />
                                    { props.focus ? (
                                        <Button
                                            className="remove-image"
                                            onClick={ onRemoveImage }
                                        >
                                            { icons.remove }
                                        </Button>
                                    ) : null }
                                </p>
                            )}
                        </div>
                        <div className="ub_testimonial_content">
                            <RichText
                                tagName="p"
                                placeholder={ __( 'This is the testimonial body. Add the testimonial text you want to add here.' ) }
                                className="ub_testimonial_text"
                                style={{
                                    fontSize: props.attributes.textSize
                                }}
                                onChange={ onChangeTestimonialText }
                                value={ props.attributes.ub_testimonial_text }
                                isSelected={ isSelected && editable === 'testimonial_content' }
                                onFocus={ onSetActiveEditable( 'testimonial_content' ) }
                                keepPlaceholderOnFocus={ true }
                            />
                        </div>
                        <div className="ub_testimonial_sign">
                            <RichText
                                tagName="p"
                                placeholder={ __( 'John Doe' ) }
                                className="ub_testimonial_author"
                                onChange={ onChangeTestimonialAuthor }
                                value={ props.attributes.ub_testimonial_author }
                                isSelected={ isSelected && editable === 'testimonial_author' }
                                onFocus={ onSetActiveEditable( 'testimonial_author' ) }
                                keepPlaceholderOnFocus={ true }
                            />
                            <RichText
                                tagName="i"
                                placeholder={ __( 'Founder, Company X' ) }
                                className="ub_testimonial_author_role"
                                onChange={ onChangeTestimonialAuthorRole }
                                value={ props.attributes.ub_testimonial_author_role }
                                isSelected={ isSelected && editable === 'testimonial_author_role' }
                                onFocus={ onSetActiveEditable( 'testimonial_author_role' ) }
                                keepPlaceholderOnFocus={ true }
                            />
                        </div>
                    </div>
                </div>
            ];
        },
    ),

    /**
     * The save function defines the way in which the different attributes should be combined
     * into the final markup, which is then serialized by Gutenberg into post_content.
     *
     * The "save" property must be specified and must be a valid function.
     *
     * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
     */
    save: function( props ) {
        return (
            <div className={ props.className }>
                <div
                    className="ub_testimonial"
                    style={{
                        backgroundColor: props.attributes.backgroundColor,
                        color: props.attributes.textColor
                    }}
                >
                    <div className="ub_testimonial_img">
                        <img
                            src={ props.attributes.imgURL }
                            alt={ props.attributes.imgAlt }
                            height={ 100 }
                            width={ 100 }
                        />
                    </div>
                    <div className="ub_testimonial_content">
                        <p
                            className="ub_testimonial_text"
                            style={{
                                fontSize: props.attributes.textSize
                            }}
                        >
                            { props.attributes.ub_testimonial_text }
                        </p>
                    </div>
                    <div className="ub_testimonial_sign">
                        <p className="ub_testimonial_author">{ props.attributes.ub_testimonial_author }</p>
                        <i className="ub_testimonial_author_role">{ props.attributes.ub_testimonial_author_role }</i>
                    </div>
                </div>
            </div>
        );
    },
} );
