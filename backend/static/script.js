// script.js

$(document).ready(function() {
    $('#uploadForm').submit(function(event) {
        event.preventDefault();
        
        // Get the video path from the input field
        var videoPath = $('#video_path').val();
        
        // Send a POST request to the Flask backend
        $.ajax({
            type: 'POST',
            url: '/process',
            data: { video_path: videoPath },
            success: function(data) {
                // Display the analysis results in the output div
                $('#output').html('<p>Transcript: ' + data.transcript + '</p>' +
                                 '<p>Sentiment Score: ' + data.sentiment_score + '</p>' +
                                 '<p>Filler Count: ' + data.filler_count + '</p>' +
                                 '<p>Grammar Errors: ' + data.grammar_errors + '</p>');
            },
            error: function(xhr, status, error) {
                // Display an error message if the request fails
                var errorMessage = xhr.responseJSON ? xhr.responseJSON.error : 'Unknown error';
                $('#output').html('<p>Error: ' + errorMessage + '</p>');
            }
        });
    });
});
