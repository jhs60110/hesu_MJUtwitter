// 댓글 로딩
async function getPost(id) {
    try {
        const res = await axios.get(`posts/${id}/contents`);
        const posts = res.data;
        const tbody = document.querySelector('.twit-comment');
        tbody.innerHTML = '';
        posts.map(function (post) {
            const edit = document.getElementById('update');
            edit.textContent = '수정';
            edit.addEventListener('click', async () => { // 수정 클릭 시
                const newPost = prompt('바꿀 내용을 입력하세요');
                if (!newPost) {
                    return alert('내용을 반드시 입력하셔야 합니다');
                }
                try {
                    await axios.patch(`/posts/${post.id}`, { post: newPost });
                    getPost(id);
                } catch (err) {
                    console.error(err);
                }
            });
            const remove = document.getElementById('del');
            remove.textContent = '삭제';
            remove.addEventListener('click', async () => { // 삭제 클릭 시
                try {
                    await axios.delete(`/posts/${post.id}`);
                    getPost(id);
                } catch (err) {
                    console.error(err);
                }
            });
            
        });
    } catch (err) {
        console.error(err);
    }
}

