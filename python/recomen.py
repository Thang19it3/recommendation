import requests
import pandas as pd
import numpy as np

from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.metrics.pairwise import cosine_similarity
from scipy.sparse import csr_matrix
from sklearn.neighbors import NearestNeighbors




app = Flask(__name__)
CORS(app)

@app.route("/", methods = ['GET'])
def home():
    try:
        # Đọc dữ liệu từ file CSV
        df_base = pd.read_csv('../python/recomen/data/rating.csv', encoding='latin1')  # Thay 'your_csv_file.csv' bằng tên file CSV của bạn
        df_base.columns = ['productId', 'userId', 'rating']  # Đặt lại tên cột

        # Tạo một bản sao của DataFrame gốc
        df = df_base.copy()

        # Tính toán số lượng đánh giá của từng người dùng
        ratings_count = df['userId'].value_counts().to_dict()

        # Lọc các người dùng có ít hơn RATINGS_CUTOFF đánh giá
        RATINGS_CUTOFF = 2
        remove_users = [user for user, count in ratings_count.items() if count < RATINGS_CUTOFF]
        df = df[~df['userId'].isin(remove_users)]

        # Tính toán số lượng đánh giá của từng sản phẩm
        ratings_count_products = df['productId'].value_counts().to_dict()

        # Lọc các sản phẩm có ít hơn RATINGS_CUTOFF đánh giá
        remove_products = [prod for prod, count in ratings_count_products.items() if count < RATINGS_CUTOFF]
        df_final = df[~df['productId'].isin(remove_products)]

        # Lấy thông tin DataFrame
        df_info = df.info()

        # Số lượng giá trị thiếu
        missing_values = df.isnull().sum().sum()

        # Mô tả tổng quan của df_final
        df_final_description = df_final.describe().T

        # Đếm số lượng đánh giá cho từng giá trị 'rating'
        rating_counts = df_final['rating'].value_counts()

        # Tạo DataFrame với thông tin tổng quan về dữ liệu
        df_uniques = pd.DataFrame(columns=['Total entries', 'Unique users', 'Unique products'])
        df_uniques.loc[0] = [len(df_final), df_final['userId'].nunique(), df_final['productId'].nunique()]

        # Top 10 người dùng có số lượng đánh giá cao nhất
        df_top10_users_ratings = df_final['userId'].value_counts().head(10).reset_index()
        df_top10_users_ratings.index = df_top10_users_ratings.index + 1
        df_top10_users_ratings.columns = ['userId', 'counts']

        # Tính trung bình đánh giá cho từng sản phẩm
        average_rating = df_final.groupby('productId')['rating'].mean()

        # Tính tổng số lượng đánh giá cho từng sản phẩm
        rating_count = df_final.groupby('productId')['rating'].count()

        # Tạo DataFrame với thông tin về trung bình và số lượng đánh giá
        df_averages_counts = pd.DataFrame({'productId': average_rating.index, 'avg_rating': average_rating, 'rating_count': rating_count})

        # Sắp xếp DataFrame theo trung bình đánh giá giảm dần
        final_rating = df_averages_counts.sort_values(by='avg_rating', ascending=False).head(5)

        # Hàm lấy ra top N sản phẩm
        def top_n_products(data, n, min_interactions=100):
            recommendations = data[data['rating_count'] >= min_interactions].sort_values(by='avg_rating', ascending=False)
            return recommendations.head(n)

        # Lấy top 5 sản phẩm với ít nhất 2 đánh giá
        top_5_50_products = top_n_products(df_averages_counts, 8, 2)
        top_ratings_list = top_5_50_products.to_dict(orient='records')

        # Chuyển đổi DataFrame thành JSON và trả về kết quả
        return jsonify(top_ratings_list)


    except Exception as e:
        # Handle any exceptions that might occur while reading or processing the CSV file
        return f"Error: {str(e)}"
@app.route("/product", methods = ['GET'])
def product():
    try:
        book_name = request.args.get('book_name')
        books = pd.read_csv('../python/recomen/data/product.csv', encoding='utf-8-sig')
        users = pd.read_csv('../python/recomen/data/user.csv', encoding='latin1')
        ratings = pd.read_csv('../python/recomen/data/rating.csv', encoding='utf-8-sig')
        
        books.head()
        users.head()
        ratings.head()
        
        
        books.isnull().sum()
        users.isnull().sum()
        ratings.isnull().sum()
        
        ratings.dropna(subset=['star'], inplace=True)
        
        
        books.duplicated().sum()
        users.duplicated().sum()
        ratings.duplicated().sum()
        
        
        books['title'].nunique()
        books.shape
        
        Book_Count_df=pd.DataFrame(books['title'].value_counts())
        Book_Count_df.reset_index(inplace=True)
        Book_Count_df.rename(columns={'index':'title','title':'Count'})
        
        User_Rating_Count=pd.DataFrame(ratings['id'].value_counts())
        User_Rating_Count.reset_index(inplace=True)
        
        User_Rating_Count.rename(columns={'index':'id','id':'Count'},inplace=True)
        
        ratings_with_name = ratings.merge(books,on='id')
        
        
        num_rating_df = ratings_with_name.groupby('title').count()['star'].reset_index()
        num_rating_df.rename(columns={'star':'num_ratings'},inplace=True)

        avg_rating_df = ratings_with_name.groupby('title').agg({'star': np.nanmean}).reset_index()
        avg_rating_df.rename(columns={'title':'title'},inplace=True)
        
        popular_df = num_rating_df.merge(avg_rating_df,on='title')
        
        popular_df = popular_df[popular_df['num_ratings']>=2].sort_values('star',ascending=False).head(50)
        #Recommending most popular books
        popular_df = popular_df.merge(books,on='title').drop_duplicates('title')[['title','num_ratings','star']]
        
        
        pd.set_option('display.max_rows', 100)
        pd.set_option('display.max_colwidth', 1000)
        
        popular_df
        
        #Collaborative Filtering Based Recommender System
        x = ratings_with_name.groupby('postedby').count()['star'] > 2 
        
        wellread_users = x[x].index
        
        wellread_users.shape
        
        filtered_rating = ratings_with_name[ratings_with_name['postedby'].isin(wellread_users)]
        
        y = filtered_rating.groupby('title').count()['star']>=1
        
        famous_books = y[y].index
        
        famous_books.shape
        
        final_ratings = filtered_rating[filtered_rating['title'].isin(famous_books)]
        
        pt = final_ratings.pivot_table(index='title',columns='postedby',values='star')
        
        pt.fillna(0,inplace=True)
        
        similarity_scores = cosine_similarity(pt)
        
        similarity_scores
        
        similarity_scores.shape
        
        def recommend(book_name):
            try:
                if pt.empty:
                    return "Error: The 'pt' DataFrame is empty."
                
                if book_name not in pt.index:
                    return f"Error: '{book_name}' not found in the dataset."
                
                index = np.where(pt.index == book_name)[0][0]
                
                if index >= len(similarity_scores):
                    return "Error: Index out of bounds for similarity_scores."
                
                similar_items = sorted(list(enumerate(similarity_scores[index])), key=lambda x: x[1], reverse=True)[1:6]

                data = []
                for i in similar_items:
                    item = []
                    temp_df = books[books['title'] == pt.index[i[0]]]
                    item.extend(list(temp_df.drop_duplicates('title')['title'].values))
                    item.extend(list(temp_df.drop_duplicates('title')['brand'].values))
                    
                    item = [int(ele) if isinstance(ele, np.int64) else ele for ele in item]

                    data.append(item)

                return data
            except Exception as e:
                return f"Error: {str(e)}"

        # Gọi hàm recommend và trả về JSON
        recommendations = recommend(book_name)
        return jsonify(recommendations)
    
        
        return 'hello python Flask'
    except Exception as e:
        return f"Eror: {str(e)}"
@app.route("/products", methods = ['GET'])
def products():
    try:
        movie = pd.read_csv('../python/recomen/data/product.csv', encoding='utf-8-sig')
        rating = pd.read_csv('../python/recomen/data/rating.csv', encoding='utf-8-sig')
        
        df = movie.merge(rating, how="left", on="id")
        
        df.isnull().sum()
        
        df.info()
        
        pd.DataFrame(df.title.value_counts())
        
        gf =pd.DataFrame(df['title'].value_counts())
        
        movie_rating_avg = df.groupby('title')['star'].mean().sort_values(ascending=False).reset_index().rename(columns={'star':'Average_rating'})
        
        movie_rating_count =df.groupby('title')['star'].count().sort_values(ascending =False).reset_index().rename(columns={'star':'Total_RatingCount'})
        
        movie_rate_count_avg = movie_rating_count.merge(movie_rating_avg,on='title')
        
        movies_df =df[~df['title'].isin(gf)]
        
        movieRating_feature= movies_df.pivot_table(index='title',columns='postedby',values='star').fillna(0)
        
        def recommendedMovie(movieRating_feature, num_recommendations=10):
            recommendations = []
            mat_movie_features_array = csr_matrix(movieRating_feature.values)
            model_knn = NearestNeighbors(metric='cosine', algorithm='brute', n_jobs=-1)
            model_knn.fit(mat_movie_features_array)
            
            for _ in range(num_recommendations):
                query_index = np.random.choice(movieRating_feature.shape[0])
                distances, indices = model_knn.kneighbors(movieRating_feature.iloc[query_index, :].values.reshape(1, -1), n_neighbors=6)
                
                for i in range(1, len(distances.flatten())):  # Start from index 1 to avoid querying itself
                    recommendations.append({
                        'movie': movieRating_feature.index[indices.flatten()[i]],
                        'distance': distances.flatten()[i]
                    })

            return recommendations[:num_recommendations]  # Return only the specified number of recommendations

        # Assuming movieRating_feature has been defined and populated before calling this function
        movie_recommendations = recommendedMovie(movieRating_feature, num_recommendations=8)

        # Return the recommendations as JSON
        return jsonify({'recommendations': movie_recommendations})
    except Exception as e:
        return f"Eror: {str(e)}"
if __name__ == "__main__":
    app.run(debug=True)
