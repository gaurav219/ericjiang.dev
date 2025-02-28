import React from 'react'
import PropTypes from 'prop-types'
import { css } from '@emotion/core'
import { Link, graphql } from 'gatsby'

// Components
import Layout from '../components/Layout'
import Container from '../components/Container'
import BlogPost from '../components/Blog/BlogPost'

// Configuration
import theme from '../../config/theme'
import { lighten } from 'polished'

const Tags = ({ pageContext, data }) => {
  console.log(pageContext, data)
  const { tag } = pageContext
  const { edges, totalCount } = data.allMarkdownRemark
  const tagHeader = `${totalCount} post${
    totalCount === 1 ? '' : 's'
  } tagged with "${tag}"`

  return (
    <Layout
      site={data.site}
      headerColor={theme.colors.white}
      headerBg={theme.colors.blog_header}
      showBlogHeader={true}
      stickyHeader={true}
    >
      <Container>
        <h2
          css={css`
            text-align: center;
            color: ${lighten(0.7, theme.brand.primary)};
          `}
        >
          {tagHeader}
        </h2>
      </Container>
      <Container>
        <div
          css={css`
            display: flex;
            flex-wrap: wrap;
          `}
        >
          {edges.map(({ node: post }) => {
            return <BlogPost post={post} />
          })}
        </div>
        <div
          css={css`
            padding: 12px 24px;
          `}
        >
          <Link
            to="/tags"
            aria-label="Visit blog page"
            css={css({
              borderRadius: 4,
            })}
          >
            <div
              css={css({
                padding: '10px 24px',
                background: lighten(0.1, theme.brand.primary),
                color: theme.colors.white,
                ':hover': {
                  background: lighten(0.2, theme.brand.primary),
                },
                maxWidth: '9rem',
                textAlign: 'center',
              })}
            >
              View all tags
            </div>
          </Link>
        </div>
      </Container>
    </Layout>
  )
}

Tags.propTypes = {
  pageContext: PropTypes.shape({
    tag: PropTypes.string.isRequired,
  }),
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      totalCount: PropTypes.number.isRequired,
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            frontmatter: PropTypes.shape({
              title: PropTypes.string.isRequired,
            }),
            fields: PropTypes.shape({
              slug: PropTypes.string.isRequired,
            }),
          }),
        }).isRequired,
      ),
    }),
  }),
}

export default Tags

export const pageQuery = graphql`
  query($tag: String) {
    site {
      ...site
    }
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
      edges {
        node {
          excerpt(pruneLength: 300)
          frontmatter {
            title
            slug
            date(formatString: "MMMM DD, YYYY")
            banner {
              childImageSharp {
                fluid(maxWidth: 600) {
                  ...GatsbyImageSharpFluid_withWebp_tracedSVG
                }
              }
            }
            tags
          }
        }
      }
    }
  }
`
