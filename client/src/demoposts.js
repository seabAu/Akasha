const getPosts = () => {
    return [ {
            userId: '123',
            _id: '1',
            likes: 1200,
            replies: 123,
            postImg: 'assets/posts/Post1.png',
            postTitle: 'Amugus',
            postContent: 'Amugus',
            postLink: `/${ 'a' }/thread/${ 1 }`,
            createdAt: Date.now(),
            comments: [ {
                userImg: `https://bit.ly/dan-abramov`,
                userName: 'a',
                text: '1'
            } ]
        },
        {
            userId: '123',
            _id: '2',
            likes: 65,
            replies: 432,
            postImg: 'assets/posts/Post2.jpeg',
            postTitle: 'Amugus 2',
            postContent: 'Amugus',
            postDate: Date.now(),
            postLink: `/${ 'a' }/thread/${ 2 }`,
            comments: [ {
                userImg: `https://bit.ly/dan-abramov`,
                userName: 'b',
                text: '2'
            } ]
        },
        {
            userId: '123',
            _id: '3',
            likes: 7,
            replies: 2,
            postImg: 'assets/posts/Post3.jpeg',
            postTitle: 'Amugus 3',
            postContent: 'Amugus',
            postDate: Date.now(),
            postLink: `/${ 'a' }/thread/${ 3 }`,
            comments: [ {
                userImg: `https://bit.ly/dan-abramov`,
                userName: 'c',
                text: '3'
            } ]
        },
        {
            userId: '123',
            _id: '4',
            likes: 111123,
            replies: 213,
            postImg: 'assets/posts/Post4.jpeg',
            postTitle: 'Amugus 4',
            postContent: 'Amugus',
            postDate: Date.now(),
            postLink: `/${ 'a' }/thread/${ 4 }`,
            comments: [ {
                userImg: `https://bit.ly/dan-abramov`,
                userName: 'd',
                text: '4'
            } ]
        }
    ];
}


export default getPosts;
